'use client';

import axiosClient from '@/libs/axios';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { UserRole } from '@prisma/client';
import { App, Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import { AxiosError } from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type Props = {
  type?: 'MODERATOR' | 'USER';
}

export default function Register({ type = UserRole.USER }: Props) {
  const [form] = Form.useForm<RegisterFormValues>();
  const router = useRouter();
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  useEffect(() => {
    if (session.status === 'authenticated') {
      const isSignOut = confirm('You are already logged in. Do you want to log out?')
      if (isSignOut) signOut()
      else router.push('/')
    }
  }, [session.status, router]);


  const handleSubmit = async (values: RegisterFormValues) => {
    if (loading) return
    setLoading(true)
    try {
      await axiosClient.post('/register', {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      message.success('Registration successful');
      setLoading(false)
      router.push('/login');
    } catch (error: unknown) {
      setLoading(false)
      if (error instanceof AxiosError) {
        message.error(error.response?.data?.error)
        console.log(error.response?.data?.error)
      }
    }
  };

  return (
    <Row justify="center" align="middle" style={{}}>
      <Col xs={23} sm={20} md={16} lg={12} xl={8}>
        <Card title="Create an Account">
          <Form<RegisterFormValues>
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please input your name!' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: type === UserRole.MODERATOR, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                {
                  pattern: /^0[0-9]{9}$/,
                  message: 'Please enter a valid Thai phone number'
                }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0812345678" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Register
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Typography.Text>
                Already have an account?{' '}
                <Typography.Link href="/login">
                  Login here
                </Typography.Link>
              </Typography.Text>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}