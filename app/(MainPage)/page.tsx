'use client';
import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, Menu, Row, Typography } from "antd";
import Image from 'next/image';
import Link from 'next/link';
import Calendar from './components/Calendar';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = () => {
  const menuItems = [
    { key: 'home', label: 'หน้าแรก' },
    { key: 'services', label: 'บริการ' },
    { key: 'about', label: 'เกี่ยวกับเรา' },
    { key: 'contact', label: 'ติดต่อ' },
  ];

  return (
    <Layout className="min-h-screen">
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Image
              src="logo/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              priority
            />
          </Col>
          <Col flex="auto">
            <Menu mode="horizontal" items={menuItems} />
          </Col>
          <Col>
            <Link href="/login">
              <Button type="primary" icon={<UserOutlined />}>
                เข้าสู่ระบบ
              </Button>
            </Link>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '50px' }}>
        {/* Hero Section */}
        {/* <Row justify="center" style={{ marginBottom: '50px' }}>
          <Col span={16} style={{ textAlign: 'center' }}>
            <Title level={2}>จองคิวออนไลน์</Title>
            <Button type="primary" size="large">
              จองคิวทันที
            </Button>
          </Col>
        </Row> */}

        {/* Quick Actions */}
        {/* <Row gutter={[24, 24]} justify="center" style={{ marginBottom: '50px' }}>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <Row justify="center" align="middle" gutter={[16, 16]}>
                <ClockCircleOutlined style={{ fontSize: '24px' }} />
                <Title level={4}>ตรวจสอบคิว</Title>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <Row justify="center" align="middle" gutter={[16, 16]}>
                <CalendarOutlined style={{ fontSize: '24px' }} />
                <Title level={4}>ดูตารางแพทย์</Title>
              </Row>
            </Card>
          </Col>
        </Row> */}
        <Row gutter={[16, 16]} justify="space-between" style={{}}>
          <Col xs={24} sm={12} md={16}>
            <Calendar />
          </Col>
          <Col xs={24} sm={12} md={8}>
            asd
          </Col>
        </Row>

        {/* Announcements */}
        <Row justify="center" style={{ marginBottom: '50px' }}>
          <Col span={20}>
            <Card title="ประกาศ / โปรโมชั่น">
              {/* Add your announcements content here */}
              <Text>ข่าวสารและโปรโมชั่นล่าสุด</Text>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        <Row justify="center" gutter={[24, 24]}>
          <Col>
            <Title level={5}>ติดต่อเรา</Title>
            <Text>โทร: 02-XXX-XXXX</Text><br />
            <Text>อีเมล: contact@example.com</Text>
          </Col>
          <Col>
            <Title level={5}>ที่อยู่</Title>
            <Text>123 ถนนตัวอย่าง แขวงตัวอย่าง</Text><br />
            <Text>เขตตัวอย่าง กรุงเทพฯ 10XXX</Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default Page;
