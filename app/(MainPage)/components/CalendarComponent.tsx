'use client';

import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface CalendarProps {
  events: Event[];
}

export default function MyCalendar({ events }: CalendarProps) {
  const handleSelectEvent = (event: Event) => {
    console.log(event);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Handle new event creation
    console.log(slotInfo);
  };
  return (
    <div className="">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '500px' }}
        defaultView="month"
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}
