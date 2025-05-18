'use client'

import { Row } from "antd";
import React, { useState } from "react";
import CalendarComponent from "./CalendarComponent";
// import CalendarComponent from "./CalendarComponent";

// const CalendarComponent = dynamic(() => import('./CalendarComponent'), {
//   ssr: false,
// });
// const dummySchedules: IEventObject[] = [
//   {
//     schedule: {
//       id: "1",
//       title: "Sample Schedule",
//       start: new Date(),
//       end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
//     },
//     changes: null,
//     end: new TZDate(new Date()),
//     start: new TZDate(new Date().getTime() + 60 * 60 * 1000)
//   }
// ]

const Calendar: React.FC = () => {
  const [events] = useState([
    {
      id: '1',
      title: 'Meeting',
      start: new Date(2025, 4, 15, 10, 0),
      end: new Date(2025, 4, 15, 11, 30),
    },
    {
      id: '2',
      title: 'Lunch',
      start: new Date(2025, 4, 15, 12, 0),
      end: new Date(2025, 4, 15, 13, 0),
    },
  ])
  return (
    <Row justify={'center'} align={'middle'}>
      <h1>Power by Big Calendar</h1>
      <CalendarComponent events={events} />
    </Row>
  );
};

export default Calendar;
