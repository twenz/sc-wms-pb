import { Dayjs } from 'dayjs';

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface EventFormValues {
  title: string;
  start: Dayjs;
  end: Dayjs;
}

export interface CalendarProps {
  events: Event[];
}