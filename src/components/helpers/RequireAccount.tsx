import { useStateObservable } from "@react-rxjs/core"
import { currentAccount$ } from "@/api"

interface RequireAccountProps {
  fallback: React.ReactNode
  children: React.ReactNode
}
export const RequireAccount: React.FC<RequireAccountProps> = ({
  fallback,
  children,
}) => (useStateObservable(currentAccount$) ? children : fallback)
