'use client';
import { Event, EventFormValues, EventMode, } from '@/types/calendar';
import { Button, FormInstance, Modal, theme } from 'antd';
import dayjs from 'dayjs';
import { SlotInfo } from 'react-big-calendar';
import { EventForm } from './EventForm';

interface EventModalProps {
  isOpen: boolean;
  mode: EventMode;
  form: FormInstance<EventFormValues>;
  selectedEvent: Event | null;
  selectedSlot: SlotInfo | null;
  onCancel: () => void;
  onDelete: () => void;
  onSubmit: (values: EventFormValues) => void;
}

export const EventModal = ({
  isOpen,
  mode,
  form,
  selectedEvent,
  selectedSlot,
  onCancel,
  onDelete,
  onSubmit
}: EventModalProps) => {
  const { token } = theme.useToken();

  return (
    <Modal
      title={
        <span style={{ color: token.colorPrimary }}>
          {mode === 'create' ? 'Create Event' : 'Edit Event'}
        </span>
      }
      open={isOpen}
      onCancel={onCancel}
      onOk={() => form.submit()}
      maskClosable={false}
      footer={[
        mode === 'edit' && (
          <Button key="delete" danger onClick={onDelete}>
            Delete
          </Button>
        ),
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {mode === 'create' ? 'Create' : 'Save'}
        </Button>,
      ].filter(Boolean)}
    >
      <EventForm
        mode={mode}
        form={form}
        onFinish={onSubmit}
        initialValues={{
          title: selectedEvent?.title || '',
          start: selectedEvent ? dayjs(selectedEvent.start) :
            selectedSlot ? dayjs(selectedSlot.start) : undefined,
          end: selectedEvent ? dayjs(selectedEvent.end) :
            selectedSlot ? dayjs(selectedSlot.end) : undefined,
        }}
      />
    </Modal>
  );
};