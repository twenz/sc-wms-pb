import Login from "@/app/components/Login"
import { Row } from "antd"

type Props = {}

const Page = (props: Props) => {
  return (
    <Row align={'middle'} justify={'center'}>
      <Login />
    </Row>
  )
}

export default Page