'use client'

import { Card, Col, Row, Typography } from 'antd';

const { Title } = Typography;

const styles = {
  container: {
    padding: 24,
  },
  card: {
    minHeight: 200,
    width: '100%',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
  }
};

const WidgetComponent = () => {
  return (
    <div style={styles.container}>
      <Row gutter={[16, 16]}>
        {/* Weather Widget */}
        <Col xs={24} md={24}>
          <Card style={styles.card}>
            <Title level={4} style={styles.title}>Weather</Title>
            <div style={styles.cardContent}>
              {/* Weather content will go here */}
              <p>Weather Information</p>
            </div>
          </Card>
        </Col>

        {/* PM2.5 Widget */}
        <Col xs={24} md={24}>
          <Card style={styles.card}>
            <Title level={4} style={styles.title}>PM2.5</Title>
            <div style={styles.cardContent}>
              {/* PM2.5 content will go here */}
              <p>Air Quality Information</p>
            </div>
          </Card>
        </Col>

        {/* Calendar Widget */}
        <Col xs={24} md={24}>
          <Card style={styles.card}>
            <Title level={4} style={styles.title}>Empty Box</Title>
            <div style={styles.cardContent}>
              {/* Calendar content will go here */}
              <p>Information</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default WidgetComponent