// src/components/PopularEvents/PopularEvents.tsx

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import agent from "../../app/api/agent";
import { Event } from "../../app/models/event";
import { useNavigate } from "react-router-dom";
import BaseEventsList from "./BaseEventsList";

const PopularEvents: React.FC = () => {
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularEvents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          Skip: "10",
          Take: "10",
          Sort: "popular", // Assuming the API supports sorting by popularity
        }).toString();
        const response = await agent.Events.list(`${queryParams}`);
        setPopularEvents(response);
      } catch (error) {
        console.error("Error fetching popular events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);

  const handleShowAll = () => {
    navigate("/events/popular");
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <BaseEventsList
      title="رویدادهای محبوب"
      events={popularEvents}
      onShowAll={handleShowAll}
      eventsToShow={5} // Display 5 events for this usage
    />
  );
};

export default observer(PopularEvents);
