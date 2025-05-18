import { FormInstance } from 'antd';
import { Dayjs } from 'dayjs';

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export interface DragEvent {
  event: Event;
  start: Date;
  end: Date;
  isAllDay?: boolean;
  description?: string;
}

export interface EventFormValues {
  title: string;
  start: Dayjs;
  end: Dayjs;
  description?: string;
}

export type EventMode = 'create' | 'edit';

export interface EventFormProps {
  mode: EventMode;
  form: FormInstance;
  onFinish: (values: EventFormValues) => void;
  initialValues?: Partial<EventFormValues>;
}

export interface CalendarProps {
  events: Event[];
}