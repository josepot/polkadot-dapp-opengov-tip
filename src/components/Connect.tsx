import { connect, availableExtensions$ } from "@/api"
import { Button } from "./ui/button"
import React from "react"
import { Subscribe, useStateObservable } from "@react-rxjs/core"

const ConnectOptions: React.FC = () => {
  const availableExtensions = useStateObservable(availableExtensions$)

  return availableExtensions.length ? (
    <ul>
      {availableExtensions.map((name) => (
        <li key={name}>
          <Button onClick={() => connect(name)}>Connect using {name}</Button>
        </li>
      ))}
    </ul>
  ) : (
    <div>No Web3 extensions detected.</div>
  )
}

export const Connect: React.FC = () => (
  <Subscribe fallback={<div>Looking for available extensions...</div>}>
    <ConnectOptions />
  </Subscribe>
)
