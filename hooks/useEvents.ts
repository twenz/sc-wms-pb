import { Event, EventFormValues } from '@/types/calendar';
import { useCallback, useState } from 'react';

export const useEvents = (initialEvents?: Event[]) => {
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper to refetch events from API (optional)
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      const data: Event[] = await res.json();
      const parsedData = data.map(event => {
        return {
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        };
      })
      setEvents(parsedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (values: EventFormValues) => {
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        throw new Error('Failed to create event');
      }
      const newEvent: Event = await res.json();
      const parsedNewEvent = {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      }
      setEvents(prev => [...prev, parsedNewEvent]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, values: EventFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        throw new Error('Failed to update event');
      }
      const updatedEvent: Event = await res.json();
      const parsedUpdatedEvent = {
        ...updatedEvent,
        start: new Date(updatedEvent.start),
        end: new Date(updatedEvent.end),
      }
      setEvents(prevEvents =>
        prevEvents.map(event => event.id === id ? parsedUpdatedEvent : event)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Failed to delete event');
      }
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, setEvents, loading, fetchEvents, createEvent, updateEvent, deleteEvent };
};