import { createClient } from "@polkadot-api/client"
import {
  Account,
  getLegacyProvider,
  knownChainsData,
  getInjectedExtensions,
} from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"
import descriptors from "../codegen/referenda"
import { SUSPENSE, state, withDefault } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { Observable, combineLatest, from, map, switchMap } from "rxjs"
import { formatBalance } from "@/lib/formatBalance"
import { AccountId, SS58String } from "@polkadot-api/substrate-bindings"

const { provider, connectAccounts: connect } =
  getLegacyProvider(createScClient())

export { connect }
export const availableExtensions$ = state(from(getInjectedExtensions()))

const chain = provider.getChains()[knownChainsData.polkadot.chainId]
export const client = createClient(chain.connect, descriptors)

export const DECIMALS = chain.decimals
export const SYMBOL = chain.symbol

const accountIdEnc = AccountId(chain.ss58Format).enc
export const isAccountValid = (address: string) => {
  try {
    accountIdEnc(address)
  } catch (_) {
    return false
  }
  return true
}

export const formatTokenAmount = (amount: bigint) =>
  formatBalance(amount, { decimals: DECIMALS })

export const accounts$ = state(
  new Observable<Account[]>((observer) =>
    chain.onAccountsChange((accounts) => {
      observer.next(accounts)
    }),
  ),
  [],
)

const [userSelectedAccount$, onUserSelectAccount] = createSignal<string>()
export { onUserSelectAccount }

export const isConnected$ = accounts$.pipeState(
  map((x) => x.length > 0),
  withDefault(false),
)

export const currentAccount$ = state(
  combineLatest([userSelectedAccount$, accounts$]).pipe(
    map(
      ([userSelected, available]) =>
        available.find((account) => userSelected === account.address) ?? null,
    ),
  ),
  null,
)

const getAccount = client.query.System.Account.watchValue
export const accountBalance$ = currentAccount$.pipeState(
  switchMap((account) => (account ? getAccount(account.address) : [null])),
  map((x) => x ?? SUSPENSE),
)
accountBalance$.subscribe()

export const useConnection = () => ({
  error: null as null | string,
  chainName: chain.name,
})

export const latestBlock$ = state(client.query.System.Number.watchValue())
latestBlock$.subscribe()

export const onSubmitReferenda = async (
  from: SS58String,
  reciver: SS58String,
  amount: bigint,
): Promise<{ track: number; index: number }> => {
  const tx = await client.tx.Referenda.submit.submit(
    from,
    {
      tag: "Origins",
      value: {
        tag: "SmallTipper",
        value: undefined,
      },
    },
    {
      tag: "Inline",
      value: await client.tx.Treasury.spend.getCallData(amount, {
        tag: "Id",
        value: reciver,
      }),
    },
    { tag: "After", value: 10 },
  )

  if (!tx.ok) throw new Error("Tx triggered errors")

  const [submittedEvent] = client.event.Referenda.Submitted.filter(tx.events)
  if (!submittedEvent)
    throw new Error("Tx is missing Referenda.Submitted event")

  return submittedEvent
}
