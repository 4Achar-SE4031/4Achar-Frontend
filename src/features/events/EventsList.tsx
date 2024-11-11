// src/components/EventsList.tsx
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

const EventsList: React.FC = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await agent.Events.list();
        setPosts(response); // Assuming pagination data comes from API if needed
        setTotalPages(Math.ceil(response.length / 12)); // Adjust for real pagination logic
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch events", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage]);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Card className="events-list">
      <div className="container-fluid">
        <div className="items">
          {loading && (
            <div className="loading">
              <Lottie options={defaultOptions} />
            </div>
          )}
          {posts.map((event) => (
            <div key={event.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
              <EventItem event={event} />
            </div>
          ))}
        </div>
        <Stack spacing={2}>
          <Pagination count={totalPages} color="primary" onChange={handleChangePage} />
        </Stack>
      </div>
    </Card>
  );
};

export default EventsList;
