import React, { useState, useEffect } from "react";
import { Event } from "../../app/models/event";
import agent from "../../app/api/agent";
import Card from "../../app/common/Card/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Lottie from "react-lottie";
import animationData from "../../app/common/lottie/Animation - 1715854965467.json";
import "./EventsList.css";
import EventItem from "./EventItem";
import mockEvents from "../../app/common/Mock Data/MOCK_DATA.json";

const FiveEvents: React.FC = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const recentEvents = [...mockEvents].sort((a, b) => Date.parse(b.start_date) - Date.parse(a.start_date)).slice(0, 5);
  const popularEvents = [...mockEvents].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };


  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Card className="events-list">
      <div className="container-fluid" lang="fa">
        <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
          <button
            className="btn btn-primary show-all"
            onClick={() => window.location.href = '/events/recent'}
          >
            نمایش همه
          </button>
          <h2 className="section-title" style={{ color: '#ffeba7', fontFamily: 'iransansweb' }}>
            رویدادهای جدید
          </h2>
        </div>

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
        </div>


        <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
          <button
            className="btn btn-primary show-all"
            onClick={() => window.location.href = '/events/recent'}
          >
            نمایش همه
          </button>
          <h2 className="section-title" style={{ color: '#ffeba7' }}>
            رویدادهای محبوب
          </h2>
        </div>
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

      </div>
    </Card>
  );
};

export default FiveEvents;
