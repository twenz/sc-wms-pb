'use client';
import { Button, Col, Form, Input, Row, Typography } from 'antd';
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';

type Props = object

const Login = ({ }: Props) => {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    console.log("Form submitted", e);

    if (!e.username || !e.password) {
      // setError("Email and password are required");
      console.log("Email and password are required");
      return;
    }

    // setIsLoading(true);
    // setError("");

    try {
      console.log('callbackUrl is', callbackUrl);
      const result = await signIn("credentials", {
        redirect: true,
        email: e.username,
        password: e.password,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        // setError("Invalid email or password");
        // setIsLoading(false);
        console.log("Invalid email or password");
        return;
      }
      console.log("Login successful", result, callbackUrl);
      // router.refresh();
      // router.replace('/dashboard');
    } catch (error) {
      // setError("An error occurred during sign in");
      // setIsLoading(false);
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
          <Form onFinish={handleSubmit}>
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