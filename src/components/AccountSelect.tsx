import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LinkBreak2Icon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { useStateObservable } from "@react-rxjs/core"
import { accounts$, currentAccount$, connect, onUserSelectAccount } from "@/api"

export const AccountSelect: React.FC = () => {
  const currentAccount = useStateObservable(currentAccount$)
  const availableAccounts = useStateObservable(accounts$)

  return (
    <Select onValueChange={onUserSelectAccount} value={currentAccount?.address}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          {availableAccounts.map((account) => (
            <SelectItem key={account.address} value={account.address}>
              {account.displayName}
            </SelectItem>
          ))}
        </SelectGroup>

        <hr className="my-1" />

        <div>
          <Button
            onClick={() => connect(null)}
            size={"icon"}
            className="w-full gap-2"
            variant={"ghost"}
          >
            <LinkBreak2Icon />
            Disconnect
          </Button>
        </div>
      </SelectContent>
    </Select>
  )
}
