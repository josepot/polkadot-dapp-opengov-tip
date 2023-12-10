import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowDownIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { cn } from "../lib/utils"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { formatBalance } from "../lib/formatBalance"
import {
  DECIMALS,
  SYMBOL,
  currentAccount$,
  formatTokenAmount,
  isAccountValid,
  onSubmitReferenda,
} from "@/api"
import { useStateObservable } from "@react-rxjs/core"

const formSchema = z.object({
  sender: z.string(),
  receiver: z.string().refine(isAccountValid),
  amount: z.bigint(),
})

export const ProposeTip: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const currentAccount = useStateObservable(currentAccount$)
  useEffect(() => {
    form.setValue("sender", currentAccount?.address ?? "")
  }, [form, currentAccount])

  return (
    <div className="relative flex w-auto flex-col space-y-2 rounded-md border p-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-6 lg:p-6">
      <div className="space-y-2">
        <h3 className="text-3xl font-extrabold leading-6 tracking-tight">
          Propose OpenGov Tip
        </h3>
        <p className="mt-1 break-words font-mono text-sm text-gray-500">
          Create a proposal to tip a beneficiary from the Polkadot treasury.
        </p>
      </div>

      <Form {...form}>
        <form
          // TODO type error of react-hook-forms?
          onSubmit={form.handleSubmit(({ sender, receiver, amount }) =>
            onSubmitReferenda(sender, receiver, amount),
          )}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex flex-row items-baseline space-x-1 text-sm">
                  <FormMessage />
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      onValueChange={(x) => {
                        field.onChange(BigInt(x))
                      }}
                      className={cn("rounded-md border p-1 font-mono", {
                        "border-red-200": fieldState.error,
                      })}
                    >
                      {[50n, 150n, 250n]
                        .map((v) => v * 10n ** BigInt(DECIMALS))
                        .map((v) => (
                          <ToggleGroupItem
                            key={v.toString()}
                            value={v.toString()}
                          >
                            {formatTokenAmount(v)}
                          </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                  </FormControl>
                  <Button
                    variant="ghost"
                    className="pointer-events-none px-3 font-mono shadow-none"
                  >
                    {SYMBOL}
                  </Button>
                </div>
              </FormItem>
            )}
          />
          <div className="relative">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                <ArrowDownIcon />
              </span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="receiver"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoCapitalize="off"
                    autoComplete="off"
                    placeholder="Beneficiary"
                    className={cn("font-mono", {
                      "border-red-200": !!fieldState.error,
                    })}
                    {...field}
                  />
                </FormControl>
                {fieldState.error && <span>{fieldState.error.message}</span>}

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="-mx-6 -mb-6 mt-4 flex flex-col gap-4 rounded-b-sm border-t border-dashed bg-muted p-6">
            <div className="flex flex-col items-end justify-end">
              <div className="relative pl-2 text-right font-mono text-sm italic">
                {form.watch("amount") ? (
                  formatBalance(BigInt(form.watch("amount")), {
                    symbol: SYMBOL,
                    decimals: DECIMALS,
                  })
                ) : (
                  <div className="h-5" />
                )}
              </div>
              <div className="relative flex w-1/2 justify-end border-t border-muted-foreground text-xs uppercase text-muted-foreground">
                Amount
              </div>
            </div>

            <div className="flex flex-col items-end justify-end">
              <div className="relative pl-2 text-right font-mono text-sm italic">
                {form.watch("receiver") ?? <div className="h-5" />}
              </div>
              <div className="relative flex w-full justify-start border-t border-muted-foreground text-xs uppercase text-muted-foreground">
                Beneficiary
              </div>
            </div>

            <div className="flex flex-col items-end justify-end">
              <div className="relative pl-2 text-right font-mono text-sm italic">
                {/*TODO: api?.consts
                  ? formatBalance(
                      api.consts.referenda.submissionDeposit.toBigInt(),
                      {
                        symbol,
                        decimals,
                      },
                    )
                  : null*/}
              </div>
              <div className="relative flex w-1/2 justify-end border-t border-muted-foreground text-xs uppercase text-muted-foreground">
                Required Deposit
              </div>
            </div>

            <div>
              <div className="relative pl-2 text-right font-mono text-sm italic">
                {currentAccount?.displayName ?? currentAccount?.address ?? (
                  <div className="h-5" />
                )}
              </div>
              <div className="relative flex w-full justify-start border-t border-muted-foreground text-xs uppercase text-muted-foreground">
                Sign with
              </div>
            </div>
            <Button
              disabled={
                form.formState.isLoading ||
                !form.formState.isValid ||
                form.formState.isSubmitting
              }
              className={cn("transition-all", {
                "m-0 h-0 p-0": !form.formState.isValid,
              })}
              type="submit"
            >
              Submit
              <Pencil1Icon
                className={cn([
                  "ml-2 transition-transform",
                  { "m-0 w-0": !form.formState.isValid },
                ])}
              />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
