'use client'

import { Row } from "antd";
import CalendarComponent from "./CalendarComponent";

const Calendar: React.FC = () => {
  // const { events, loading, fetchEvents } = useEvents([]);
  // console.log("🚀 ~ events:", events)

  // useEffect(() => {
  //   fetchEvents();
  // }, [fetchEvents]);

  // if (loading) {
  //   return (
  //     <Row justify="center" align="middle" style={{ height: '80vh' }}>
  //       <Skeleton active />
  //     </Row>
  //   );
  // }

  return (
    <Row justify="center" align="middle">
      <h1>Powered by Big Calendar</h1>
      <CalendarComponent />
    </Row>
  );
};

export default Calendar;
