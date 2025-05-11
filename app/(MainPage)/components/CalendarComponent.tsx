'use client';

import { CalendarProps, Event, EventFormValues } from '@/types/calendar';
import { Form, Modal, theme } from 'antd';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { CSSProperties, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventForm } from './EventForm';

const styles = {
  calendar: {
    height: '500px',
    padding: '24px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  } as CSSProperties,
  container: {
    minHeight: '100vh',
    padding: '24px',
  } as CSSProperties,
};

export default function MyCalendar({ events: initEvent }: CalendarProps) {
  const { token } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [events, setEvents] = useState<Event[]>(initEvent);
  const [form] = Form.useForm<EventFormValues>();

  const localizer = useMemo(() => dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': enUS }
  }), []);

  const handleSelectEvent = (event: Event) => {
    // Handle event selection
    console.log('Selected event:', event);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (values: EventFormValues) => {
    const newEvent = {
      id: crypto.randomUUID(),
      title: values.title,
      start: values.start.toDate(),
      end: values.end.toDate(),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedSlot(null);
    setIsModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.calendar}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          style={{ height: '100%' }}
        />
      </div>

      <Modal
        title={<span style={{ color: token.colorPrimary }}>Create Event</span>}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        maskClosable={false}
        style={{ maxWidth: '600px' }}
        destroyOnClose
      >
        <EventForm
          form={form}
          onFinish={handleCreateEvent}
          initialValues={{
            title: '',
            start: selectedSlot ? dayjs(selectedSlot.start) : undefined,
            end: selectedSlot ? dayjs(selectedSlot.end) : undefined
          }}
        />
      </Modal>
    </div>
  );
}
