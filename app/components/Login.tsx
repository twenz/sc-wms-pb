'use client';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

type Props = object
type LoginFormProps = {
  username: string;
  password: string;
}

const Login = ({ }: Props) => {
  const [form] = Form.useForm<LoginFormProps>();
  const callbackUrl = useSearchParams().get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: LoginFormProps) => {

    if (!e.username || !e.password) {
      console.log("Email and password are required");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: true,
        email: e.username,
        password: e.password,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        console.log("Invalid email or password");
        return;
      }
    } catch (error) {
      console.error("An error occurred during sign in", error);
    }
  };

  return (
    <Row justify="center" align="middle" gutter={[16, 16]} style={{ maxWidth: '400px', maxHeight: '400px', padding: '16px' }} >
      <Col span={24}>
        <Row>
          <Col span={8}>
            <div style={{ width: '96px', height: '96px', backgroundColor: 'red' }}></div>
          </Col>
          <Col span={16} style={{ textAlign: "left" }}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Welcome to the App
            </Typography.Title>
            <Typography.Text type="secondary">
              Please login to continue
            </Typography.Text>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[0, 16]}>
          <Form<LoginFormProps> form={form} onFinish={handleSubmit}>
            <Col span={24}>
              <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input placeholder="Username" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password placeholder="password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item >
                <Button htmlType='submit' type="primary" block>
                  Login
                </Button>
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              Register / ForgotPassword
            </Col>
          </Form>
        </Row>
      </Col>
    </Row >
  )
}

export default Login