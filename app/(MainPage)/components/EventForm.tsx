'use client';
import { EventFormValues, EventMode } from '@/types/calendar';
import { DatePicker, Form, FormInstance, Input } from 'antd';
import { useEffect, useState } from 'react';

interface EventFormProps {
  mode: EventMode;
  form: FormInstance<EventFormValues>;
  initialValues?: Partial<EventFormValues>;
  onFinish: (values: EventFormValues) => void;
}

export const EventForm = ({ form, initialValues, onFinish }: EventFormProps) => {
  // Local state if required
  const [event, setEvent] = useState(initialValues || {});

  useEffect(() => {
    setEvent(initialValues || {});
    form.setFieldsValue({
      title: initialValues?.title,
      start: initialValues?.start,
      end: initialValues?.end,
    });
  }, [form, initialValues]);

  // Disable minutes that are not XX:00 or XX:30
  const disabledMinutes = () =>
    Array.from({ length: 60 }, (_, i) => i).filter(m => m % 30 !== 0);

  return (
    <Form
      preserve={false}
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={event}
    >
      <Form.Item
        id='title'
        name="title"
        label="Event Title"
        rules={[{ required: true, message: 'Please enter event title' }]}
      >
        <Input placeholder="Enter event title" />
      </Form.Item>

      <Form.Item
        id='start'
        name="start"
        label="Start Time"
        rules={[{ required: true, message: 'Please select start time' }]}
      >
        <DatePicker
          showTime={{
            format: 'HH:mm',
            minuteStep: 30,
            disabledMinutes,
          }}
          format="YYYY-MM-DD HH:mm"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        id='end'
        name="end"
        label="End Time"
        rules={[
          { required: true, message: 'Please select end time' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || !getFieldValue('start') || getFieldValue('start').isBefore(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('End time must be after start time'));
            },
          }),
        ]}
      >
        <DatePicker
          showTime={{
            format: 'HH:mm',
            minuteStep: 30,
            disabledMinutes,
          }}
          format="YYYY-MM-DD HH:mm"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item id='description' name='description' label='Event Description'>
        <Input.TextArea
          placeholder='Enter event description, max 256 characters'
          autoSize={{ minRows: 4, maxRows: 4 }}
          maxLength={256}
        />
      </Form.Item>
    </Form>
  );
};