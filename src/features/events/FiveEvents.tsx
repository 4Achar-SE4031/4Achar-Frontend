import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Lottie from "react-lottie";
import { observer } from "mobx-react-lite";

import { Event } from "../../app/models/event";
import EventItem from "./EventItem";
import Card from "../../app/common/Card/Card";
import agent from "../../app/api/agent";
import animationData from "../../app/common/lottie/Animation - 1715854965467.json";
import "./EventsList.css";
import mockEvents from "../../app/common/Mock Data/MOCK_DATA.json";
import { useStore } from "../../app/store/Store";
import { useNavigate } from "react-router-dom";

const FiveEvents: React.FC = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { eventStore } = useStore()
  const [recentEventIndex, setRecentEventIndex] = useState(0);
  const [popularEventIndex, setPopularEventIndex] = useState(0);
  const eventsToShow = 5;
  const { eventType, showType, setEventType } = eventStore;
  const navigate = useNavigate();

  const recentEvents = [...mockEvents]
    .sort((a, b) => Date.parse(b.start_date) - Date.parse(a.start_date))
    .slice(recentEventIndex, recentEventIndex + eventsToShow);

  const popularEvents = [...mockEvents]
    .sort((a, b) => b.rating - a.rating)
    .slice(popularEventIndex, popularEventIndex + eventsToShow);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRecentEventIndex((prevIndex) =>
        prevIndex + 1 >= mockEvents.length - eventsToShow ? 0 : prevIndex + 1
      );
      setPopularEventIndex((prevIndex) =>
        prevIndex + 1 >= mockEvents.length - eventsToShow ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);


  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleShowTypeButton = (value: string) => {
    setEventType(value)
    console.log(value)
    navigate(`/events/${value}`)
  }

  return (
    <Card className="events-list">
      <div className="container-fluid" lang="fa">
        <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
          <button
            className="btn btn-primary show-all"
            onClick={() => handleShowTypeButton("recent")}
          >
            نمایش همه
          </button>
          <h2 className="section-title" style={{ color: '#ffeba7', fontFamily: 'iransansweb' }}>
            رویدادهای جدید
          </h2>
        </div>
        <div className="position-relative">
          <button
            className="slider-arrow left"
            onClick={() => setRecentEventIndex(prev =>
              prev === 0 ? mockEvents.length - eventsToShow : prev - 1
            )}
          >
            &#8249;
          </button>
          <div className="items">
            {/* {loading && (
            <div className="loading">
              <Lottie options={defaultOptions} />
            </div>
          )} */}
            {recentEvents.map(event => (
              <div key={event.id} className="col-lg-2 col-md-3 col-sm-5 mb-3">
                <EventItem event={event} />
              </div>
            ))}

            <button
              className="slider-arrow right"
              onClick={() => setRecentEventIndex(prev =>
                prev + 1 >= mockEvents.length - eventsToShow ? 0 : prev + 1
              )}
            >
              &#8250;
            </button>
          </div>

        </div>


        <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
          <button
            className="btn btn-primary show-all"
            // onClick={() => window.location.href = '/events/popular'}
            onClick={() => handleShowTypeButton("popular")}
          >
            نمایش همه
          </button>
          <h2 className="section-title" style={{ color: '#ffeba7' }}>
            رویدادهای محبوب
          </h2>
        </div>

        <div className="position-relative">
          <button
            className="slider-arrow left"
            onClick={() => setPopularEventIndex(prev =>
              prev === 0 ? mockEvents.length - eventsToShow : prev - 1
            )}
          >
            &#8249;
          </button>
          <div className="items">
            {/* {loading && (
            <div className="loading"> 
              <Lottie options={defaultOptions} />
            </div>
          )} */}
            {popularEvents.map(event => (
              <div key={event.id} className="col-md-2 col-sm-6 mb-3">
                <EventItem event={event} />
              </div>
            ))}
          </div>
          <button
            className="slider-arrow right"
            onClick={() => setPopularEventIndex(prev =>
              prev + 1 >= mockEvents.length - eventsToShow ? 0 : prev + 1
            )}
          >
            &#8250;
          </button>
        </div>
      </div>
    </Card>
  );
};

export default observer(FiveEvents);
