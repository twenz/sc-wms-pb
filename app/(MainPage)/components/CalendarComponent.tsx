'use client';

import { useEvents } from '@/hooks/useEvents';
import { CalendarProps, Event, EventFormValues, EventMode } from '@/types/calendar';
import { Form, Skeleton } from 'antd';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModal } from './EventModal';

const DnDCalendar = withDragAndDrop<Event>(Calendar);

const styles = {
  calendar: {
    height: '100%',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  } as CSSProperties,
  container: {
    width: '100%',
    height: '80vh',
    padding: '1rem',
  } as CSSProperties,
};

const minTime = new Date();
minTime.setHours(8, 0, 0); // 08:00

const maxTime = new Date();
maxTime.setHours(18, 0, 0); // 18:00

export default function MyCalendar({ }: CalendarProps) {
  const { events, createEvent, updateEvent, deleteEvent, fetchEvents } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mode, setMode] = useState<EventMode>('create');
  const [form] = Form.useForm<EventFormValues>();
  const { status, data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const localizer = useMemo(() => dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': enUS }
  }), []);

  const roundToNearestThirty = useCallback((value: dayjs.Dayjs) => {
    const minutes = value.minute();
    const roundedMinutes = Math.round(minutes / 30) * 30;
    return value.minute(roundedMinutes).second(0);
  }, []);

  const handleSelectEvent = useCallback((event: Event) => {
    if (!isAdmin) return;

    setSelectedEvent(event);
    setMode('edit');
    form.setFieldsValue({
      title: event.title,
      start: dayjs(event.start),
      end: dayjs(event.end),
      description: event.description,
    });
    setIsModalOpen(true);
  }, [isAdmin, form]);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (!isAdmin) return;

    setSelectedSlot(slotInfo);
    setMode('create');
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, [isAdmin]);

  const handleEventModification = useCallback(({ event, start, end }: { event: Event, start: string | Date, end: string | Date }) => {
    if (!isAdmin) return;

    const roundedStart = roundToNearestThirty(dayjs(new Date(start)));
    const roundedEnd = roundToNearestThirty(dayjs(new Date(end)));

    updateEvent(event.id, { ...event, start: roundedStart, end: roundedEnd });
  }, [isAdmin, roundToNearestThirty, updateEvent]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setSelectedSlot(null);
    setSelectedEvent(null);
    setIsModalOpen(false);
    setMode('create');
  }, [form]);

  const handleDelete = useCallback(() => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      handleCancel();
    }
  }, [selectedEvent, handleCancel, deleteEvent]);

  const handleSubmit = useCallback((values: EventFormValues) => {
    if (mode === 'create') {
      createEvent(values);
    } else if (mode === 'edit' && selectedEvent) {
      updateEvent(selectedEvent.id, values);
    }
    handleCancel();
  }, [mode, selectedEvent, handleCancel, createEvent, updateEvent]);

  if (status === 'loading') return <Skeleton />;

  return (
    <div style={styles.container}>
      <div style={styles.calendar}>
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={isAdmin ? 'week' : 'month'}
          selectable={isAdmin}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          style={{ height: '100%' }}
          views={['month', 'week', 'day']}
          min={minTime}
          max={maxTime}
          draggableAccessor={() => isAdmin}
          resizable={isAdmin}
          resizableAccessor={() => isAdmin}
          onEventDrop={handleEventModification}
          onEventResize={handleEventModification}
          tooltipAccessor={(event) => event.title}
          step={30}
          timeslots={2}
          popup
        />
      </div>

      {isAdmin && (
        <EventModal
          isOpen={isModalOpen}
          mode={mode}
          form={form}
          selectedEvent={selectedEvent}
          selectedSlot={selectedSlot}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
