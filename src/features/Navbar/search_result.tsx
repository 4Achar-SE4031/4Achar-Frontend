import React, { useEffect, useState } from "react";
import axios from "axios";
import EventItem from "../events/EventItem"; // مسیر صحیح برای ایمپورت EventItem را وارد کنید.
import { Event } from "../../app/models/event";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Event[]>("https://your-backend-url.com/api/events");
        setEvents(response.data);
        setError(null);
      } catch (err) {
        setError("خطا در بارگذاری اطلاعات. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-list">
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
