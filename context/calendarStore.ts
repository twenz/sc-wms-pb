import {
  IEventObject,
  IEventScheduleObject,
  ISchedule,
  TEventBeforeCreateSchedule
} from 'tui-calendar';
import { create } from 'zustand';

interface CalendarStore {
  // State
  schedules: ISchedule[];
  view: 'day' | 'week' | 'month';
  selectedDate: Date;
  isLoading: boolean;

  // Actions
  addSchedule: (schedule: TEventBeforeCreateSchedule) => void;
  updateSchedule: (eventObj: IEventObject) => void;
  deleteSchedule: (eventObj: IEventScheduleObject) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
  setSelectedDate: (date: Date) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  // Initial state
  schedules: [],
  view: 'week',
  selectedDate: new Date(),
  isLoading: false,

  // Actions
  addSchedule: (scheduleData) => {
    set((state) => ({
      schedules: [...state.schedules, {
        id: String(Date.now()),
        calendarId: '1',
        ...scheduleData
      } as ISchedule]
    }));
  },

  updateSchedule: (eventObj) => {
    const { schedule, changes } = eventObj;
    set((state) => ({
      schedules: state.schedules.map((item) =>
        item.id === schedule.id ? { ...item, ...changes } : item
      )
    }));
  },

  deleteSchedule: (eventObj) => {
    const { schedule } = eventObj;
    set((state) => ({
      schedules: state.schedules.filter((item) => item.id !== schedule.id)
    }));
  },

  setView: (view) => set({ view }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (isLoading) => set({ isLoading })
}));