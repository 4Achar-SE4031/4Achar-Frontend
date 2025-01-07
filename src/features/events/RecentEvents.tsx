// src/components/RecentEvents/RecentEvents.tsx

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import agent from "../../app/api/agent";
import { Event } from "../../app/models/event";
import { useNavigate } from "react-router-dom";
import BaseEventsList from "./BaseEventsList";

const RecentEvents: React.FC = () => {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentEvents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          Skip: "0",
          Take: "10",
          Sort: "recent", // Assuming the API supports sorting by recent
        }).toString();
        const response = await agent.Events.list(`${queryParams}`);
        setRecentEvents(response);
      } catch (error) {
        console.error("Error fetching recent events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  const handleShowAll = () => {
    navigate("/events/recent");
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <BaseEventsList
      title="رویدادهای جدید"
      events={recentEvents}
      onShowAll={handleShowAll}
      eventsToShow={5} // Display 5 events for this usage
    />
  );
};

export default observer(RecentEvents);
