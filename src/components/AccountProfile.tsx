import { useStateObservable } from "@react-rxjs/core"
import { accountBalance$, currentAccount$, formatTokenAmount } from "@/api"
import { Suspense } from "react"

const AccountBalances = () => {
  const balances = useStateObservable(accountBalance$)

  return (
    <div className="flex flex-row justify-around">
      <div className="flex flex-1 flex-col items-end justify-center space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="text-2xl font-bold tabular-nums">
          {formatTokenAmount(balances.data.free)}
        </div>
        <p className="text-xs text-muted-foreground">Free</p>
      </div>
      <div className=" flex flex-1 flex-col items-end justify-center space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="text-2xl font-bold tabular-nums">
          {formatTokenAmount(balances.data.reserved)}
        </div>
        <p className="text-xs text-muted-foreground">Reserved</p>
      </div>
      <div className=" flex flex-1 flex-col items-end justify-center space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="text-2xl font-bold tabular-nums">
          {formatTokenAmount(balances.data.frozen)}
        </div>
        <p className="text-xs text-muted-foreground">Frozen</p>
      </div>
    </div>
  )
}

export const AccountProfile: React.FC = () => {
  const currentAccount = useStateObservable(currentAccount$)

  return (
    currentAccount && (
      <div className="relative flex w-auto flex-col space-y-2 rounded-md border p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-6 lg:p-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold leading-6 tracking-tight">
            {currentAccount.displayName}
          </h2>
          <p className="mt-1 break-all font-mono text-sm text-gray-500">
            {currentAccount.address}
          </p>
        </div>

        <Suspense fallback={null}>
          <AccountBalances />
        </Suspense>
      </div>
    )
  )
}
