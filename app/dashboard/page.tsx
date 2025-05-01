'use client'

import { useSession } from "next-auth/react"


type Props = object

const Page = ({ }: Props) => {
  const { status, data } = useSession()
  console.log("🚀 ~ Page ~ data:", data, status)

  return (
    <div>Page</div>
  )
}

export default Page