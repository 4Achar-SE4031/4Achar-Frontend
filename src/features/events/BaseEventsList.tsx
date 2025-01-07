// src/components/BaseEventsList/BaseEventsList.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../app/common/Card/Card";
import "./BaseEventsList.css";
import { Event } from "../../app/models/event";
import EventItem from "./EventItem";

interface BaseEventsListProps {
  title: string;
  events: Event[];
  onShowAll: () => void;
  eventsToShow?: number;
}

const BaseEventsList: React.FC<BaseEventsListProps> = ({
  title,
  events,
  onShowAll,
  eventsToShow = 5,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const eventCount = events.length;

  useEffect(() => {
    const autoAdvance = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % eventCount);
    }, 6000); // 6 seconds

    return () => clearInterval(autoAdvance);
  }, [eventCount]);

  const handleIndexChange = (direction: "next" | "prev") => {
    setCurrentIndex((prevIndex) =>
      direction === "next"
        ? (prevIndex + 1) % eventCount
        : (prevIndex - 1 + eventCount) % eventCount
    );
  };

  const getVisibleEvents = () => {
    if (eventCount <= eventsToShow) return events;
    return [
      ...events.slice(currentIndex, currentIndex + eventsToShow),
      ...events.slice(0, Math.max(0, currentIndex + eventsToShow - eventCount)),
    ].slice(0, eventsToShow);
  };

  const renderIndicators = () => (
    <div className="slider-indicators">
      {events.map((_, index) => (
        <span
          key={index}
          className={`dot ${currentIndex === index ? "active" : ""}`}
          onClick={() => setCurrentIndex(index)}
        />
      ))}
    </div>
  );

  return (
    <Card className="events-list pb-5" lang="fa">
      <div className="container-fluid" lang="fa">
        <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
          <button className="btn btn-primary show-all" onClick={onShowAll}>
            نمایش همه
          </button>
          <h2
            className="section-title"
            style={{ color: "#ffeba7", fontFamily: "iransansweb" }}
          >
            {title}
          </h2>
        </div>
        <div className="position-relative row justify-content-center align-content-center">
          {eventCount > eventsToShow && (
            <button
              className="slider-arrow left col"
              onClick={() => handleIndexChange("prev")}
            >
              &#8249;
            </button>
          )}
          <div className="items col-lg-11 col-sm-9">
            {getVisibleEvents().map((event) => (
              <div key={event.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <EventItem event={event} />
              </div>
            ))}
          </div>
          {eventCount > eventsToShow && (
            <button
              className="slider-arrow right col"
              onClick={() => handleIndexChange("next")}
            >
              &#8250;
            </button>
          )}
        </div>
        {renderIndicators()}
      </div>
    </Card>
  );
};

export default BaseEventsList;
