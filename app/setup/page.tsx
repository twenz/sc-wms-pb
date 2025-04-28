'use client';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Result } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SetupPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkIfSetupNeeded();
  }, []);

  const checkIfSetupNeeded = async () => {
    try {
      const response = await axios.get('/api/users');
      setInitialized(true);
    } catch (error) {
      if (error.response?.status === 403) {
        setInitialized(false);
      }
    } finally {
      setChecking(false);
    }
  };

  const handleSetup = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/setup', values);
      message.success('ตั้งค่าผู้ดูแลระบบเริ่มต้นเรียบร้อยแล้ว');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Setup error:', error);
      if (error.response?.data?.error) {
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="ตั้งค่าผู้ดูแลระบบเริ่มต้น" style={{ width: 500 }}>
        <Form
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
