'use client';
import { errorMessages } from '@/libs/api-utils';
import { App, Button, Col, Form, Input, Row, Skeleton, Typography } from 'antd';
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type Props = object
type LoginFormProps = {
  username: string;
  password: string;
}

const Login = ({ }: Props) => {
  const callbackUrl = useSearchParams().get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginFormProps>();
  const { message } = App.useApp();
  const { status } = useSession()

  const handleSubmit = async (e: LoginFormProps) => {
    if (loading) return
    setLoading(true);

    if (!e.username || !e.password) {
      console.log("Email and password are required");
      return;
    }
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: e.username,
        password: e.password,
        callbackUrl: callbackUrl,
      });
      if (result?.error) {
        if (result?.error === "CredentialsSignin") message.error(errorMessages.invalidData)
        else message.error(result.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      redirect(result?.url || callbackUrl);
    } catch (error) {
      setLoading(false)
      console.error("An error occurred during sign in", error);
    }
  };

  if (status === "authenticated") {
    redirect(callbackUrl);
  }
  if (status === "loading") {
    return <Skeleton />
  }

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
              <Link href={'/register'}>Register</Link> / <Link href={'/forgot-password'}>Forgot Password</Link>
            </Col>
          </Form>
        </Row>
      </Col>
    </Row >
  )
}

export default Login