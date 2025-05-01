'use client'

import Login from "@/app/components/Login"
import { Row, Skeleton } from "antd"
import { Suspense } from "react"

const Page = () => {
  return (
    <Row align={'middle'} justify={'center'}>
      <Suspense fallback={<Skeleton />}>
        <Login />
      </Suspense>
    </Row>
  )
}

export default Page