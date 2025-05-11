import { EventFormValues } from '@/types/calendar';
import { DatePicker, Form, FormInstance, Input } from 'antd';
import { useEffect } from 'react';

interface EventFormProps {
  form: FormInstance<EventFormValues>
  initialValues?: Partial<EventFormValues>;
  onFinish: (values: EventFormValues) => void;
}

export const EventForm = ({ form, initialValues, onFinish }: EventFormProps) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        start: initialValues.start,
        end: initialValues.end,
      });
    }
  }, [initialValues, form]);

  return (
    <Form
      preserve={false}
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="title"
        label="Event Title"
        rules={[{ required: true, message: 'Please enter event title' }]}
      >
        <Input placeholder="Enter event title" />
      </Form.Item>

      <Form.Item
        name="start"
        label="Start Time"
        rules={[{ required: true, message: 'Please select start time' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="end"
        label="End Time"
        rules={[
          { required: true, message: 'Please select end time' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('start').isBefore(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('End time must be after start time'));
            },
          }),
        ]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          changeOnBlur
          style={{ width: '100%' }}
        />
      </Form.Item>
    </Form>
  );
};