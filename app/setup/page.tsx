'use client';
import axiosClient from '@/libs/axios';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { User, UserRole } from '@prisma/client';
import { Button, Card, Form, Input, message, Result } from 'antd';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './style.css';
interface SetupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SetupPage() {
  const [form] = Form.useForm<SetupFormValues>();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkIfSetupNeeded();
  }, []);

  const checkIfSetupNeeded = async () => {
    try {
      const admins: User[] = await axiosClient.get('/users', {
        params: {
          role: UserRole.ADMIN
        }
      }).then(res => res.data);
      setInitialized(admins.length > 0);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        setInitialized(false);
      }
    } finally {
      setChecking(false);
    }
  };

  const handleSetup = async (values: SetupFormValues) => {
    setLoading(true);
    try {
      await axiosClient.post('/setup', values);
      message.success('ตั้งค่าผู้ดูแลระบบเริ่มต้นเรียบร้อยแล้ว');
      router.push('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error('เกิดข้อผิดพลาดในการตั้งค่าเริ่มต้น');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex-center-container">
        <p>กำลังตรวจสอบสถานะระบบ...</p>
      </div>
    );
  }

  if (initialized) {
    return (
      <Result
        status="info"
        title="ระบบได้รับการตั้งค่าเรียบร้อยแล้ว"
        subTitle="ระบบมีผู้ดูแลระบบอยู่แล้ว ไม่สามารถตั้งค่าเริ่มต้นได้อีก"
        extra={
          <Button type="primary" onClick={() => router.push('/')}>
            กลับไปยังหน้าเข้าสู่ระบบ
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex-center-container">
      <Card title="ตั้งค่าผู้ดูแลระบบเริ่มต้น" style={{ width: 500 }}>
        <Form<SetupFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSetup}
        >
          <Form.Item
            name="name"
            label="ชื่อ"
            rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="อีเมล"
            rules={[
              { required: true, message: 'กรุณากรอกอีเมล' },
              { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="เบอร์โทรศัพท์"
            rules={[
              { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
              {
                pattern: /^0[0-9]{9}$/,
                message: 'รูปแบบไม่ถูกต้อง กรุณากรอกเบอร์โทรศัพท์ 10 หลัก ขึ้นต้นด้วย 0'
              }
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="รหัสผ่าน"
            rules={[
              { required: true, message: 'กรุณากรอกรหัสผ่าน' },
              { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            dependencies={['password']}
            rules={[
              { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              ตั้งค่าระบบ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
