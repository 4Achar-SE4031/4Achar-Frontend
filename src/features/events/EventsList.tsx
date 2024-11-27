import React, { useState, useEffect } from "react";
import Card from "../../app/common/Card/Card";
// import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Lottie from "react-lottie";
import { observer } from "mobx-react-lite";

import { Event } from "../../app/models/event";
import agent from "../../app/api/agent";
import animationData from "../../app/common/lottie/Animation - 1715854965467.json";
import "./EventsList.css";
import EventItem from "./EventItem";
import mockEvents from "../../app/common/Mock Data/MOCK_DATA.json";
import { useStore } from "../../app/store/Store";
import { useLocation } from "react-router-dom";
import Pagination from "../../app/common/Pagination";


const EventsList: React.FC = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [index, setIndex] = useState<number>(1);
  const [title, setTitle] = useState<string>();
  const { eventStore } = useStore()
  const { eventType, setEventType } = eventStore
  // const [sortType, setSortType] = useState<string | undefined>(eventType)
  const location = useLocation()


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await agent.Events.list();
  //       setPosts(response);
  //       setTotalPages(Math.ceil(response.length / 12));
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Failed to fetch events", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchEvents();
  // }, [currentPage]);
  useEffect(() => {
    setLoading(true);
    // Mock data handling instead of API call
    // setSortType(eventType)
    // console.log(sortType)
    let sortedEvents = [...mockEvents];
    if (!eventType){
      setEventType(location.pathname.split("/")[2])
    }
    if (eventType === "recent") {
      sortedEvents = sortedEvents.sort((a, b) => Date.parse(b.start_date) - Date.parse(a.start_date));
      setTitle("جدیدترین رویدادها")
    } else if (eventType === "popular") {
      sortedEvents = sortedEvents.sort((a, b) => b.rating - a.rating);
      setTitle("محبوب ترین رویدادها")
      
    }

    setPosts(sortedEvents.slice(15 * (index - 1), 15 * index));
    setTotalPages(Math.ceil(sortedEvents.length / 15));
    setLoading(false);
  }, [eventType, currentPage]);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    setIndex(value)
    window.scrollTo(0, 0);

  };

  return (
    <Card className="events-list">
      <div className="container-fluid mb-1" lang="fa">
        <div className="text-right mb-2 mt-4">
          <h2 className="section-title" style={{ color: '#ffeba7', fontFamily: 'iransansweb' }}>
            {title}
          </h2>
        </div>
        <div className="items pb-5">
          {loading && (
            <div className="loading">
              <Lottie options={defaultOptions} />
            </div>
          )}
          {posts.map((event) => (
            <div key={event.id} className="col-xl-2 col-lg-3 col-md-5 col-sm-12">
              <EventItem event={event} />
            </div>
          ))}
          <Stack spacing={2}>
            <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} />
          </Stack>
        </div>
      </div>
    </Card>
  );
};

export default observer(EventsList);
