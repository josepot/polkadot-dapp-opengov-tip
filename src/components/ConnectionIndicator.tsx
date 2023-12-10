import { cx } from "class-variance-authority"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { latestBlock$, useConnection } from "@/api"
import { Suspense } from "react"

export const ConnectionIndicator: React.FC = () => {
  const connection = useConnection()
  const isError = connection.error !== null

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="relative flex h-3 w-3 hover:cursor-pointer">
          <span
            className={cx([
              "absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75",
              { "animate-ping bg-red-400": isError },
            ])}
          />
          <span
            className={cx([
              "relative inline-flex h-3 w-3 rounded-full bg-sky-500",
              { "bg-red-500": isError },
            ])}
          />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <div className="flex flex-row items-start gap-3">
          <div className="py-2">
            <span className="relative flex h-3 w-3">
              <span
                className={cx([
                  "absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75",
                  { "animate-ping bg-red-400": isError },
                ])}
              />
              <span
                className={cx([
                  "relative inline-flex h-3 w-3 rounded-full bg-sky-500",
                  { "bg-red-500": isError },
                ])}
              />
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {isError ? (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">API Issue</h4>
                <p className="text-sm">{connection.error}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  Everything working as expected
                </h4>
                <p className="text-sm">
                  <Suspense fallback={<>Loading finalized block...</>}>
                    #{latestBlock$}
                  </Suspense>
                </p>
              </div>
            )}

            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                Used Light Client (Smoldot)
              </h4>
              <p className="text-sm">{connection.chainName}</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
