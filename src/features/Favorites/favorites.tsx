import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/navbar";
import Lottie from "react-lottie";
import animationData from "../user/concertDetailsPage/Animation - 1715854965467.json";
import PageNotFound from "../user/concertDetailsPage/PageNotFound/PageNotFound";

import { useNavigate } from "react-router-dom";

const Favorites: React.FC = () => {
  const [data, setData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();
  
  const defaultOptions = {
      loop: true,
      autoplay: true,
      clickToPause: true,
      animationData: animationData,
  };
  const internalServerErrorDefaultOptions = {
    loop: true,
    autoplay: true,
    clickToPause: true,
    animationData: "/Animation - ServerInternalError.json",
  }
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");

      try {
        
        const response = await axios.get(
          `https://api-concertify.darkube.app/Concert/search?searchTerm=محمد`, 
          {
            headers: {
              "Content-Type": "application/json",
              accept: "text/plain",
            },
          }
        );
        // throw new Error("Server Internal Error");

        setTimeout(() => {
          if (response.data && Object.keys(response.data).length > 0){
            setData(response.data); 
            console.log("Data to show "+response.data);
            setIsLoading(false);
            setIsLoaded(true);
            setHasError(false);
            console.log("isLoaded: "+isLoaded);
          }else{
            setIsLoading(false);
            setIsLoaded(false);
            setHasError(false);
            console.log("Nothing to show "+response.data);
            console.log("isLoaded: "+isLoaded);
          }
          
        }, 1000);
      } catch (err) {
        
        console.log("Error during API call:", err);
        setTimeout(() => {
            setIsLoading(false);
            setIsLoaded(false);
            setHasError(true);
        }, 1000);
      }
    };
    fetchData();
  }, []); 

 
  if(hasError){
      return (
        <div className="event-details">
            <Navbar />

            <div
                className="container col"
                style={{
                  height: "50%",
                  width: "70%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
            >
                <Lottie options={internalServerErrorDefaultOptions} />
            </div>
        </div>
    );
  }
  if(!isLoading && !hasError && !isLoaded){
    return <PageNotFound />;
  }
  if(isLoading ){
    return (
      <div className="event-details">
          <Navbar />

          <div
              className="container col loading"
              style={{
                  height: "200px",
                  width: "200px",
                  marginTop: "15%",
              }}
          >
              <Lottie options={defaultOptions} />
          </div>
      </div>
  );
  }
  if (!data && !hasError){
    console.log("if (!data && searchStatus !==gotError){")
    setIsLoading(true);  
  }

  return (
    <>
      <Navbar />
      <div className="searchpage">
        <div className="results">
          {data.map((item: any) => (
            <div
              key={item.id}
              className="concert-card"
              style={{ backgroundImage: `url(${item.cardImage})` }}
              onClick={() => {
                navigate(`/concertDetail/${item.id}`)
                // setSearchStatus("loading")
              }}
            >
              <div className="card-content">
                <h2>{item.title}</h2>
                <p>
                  <i className="bi bi-geo-alt" style={{ marginLeft: '5px', fontSize: "13px"}}></i>
                  {item.location}
                </p>
                <div className="row">
          <p style={{marginTop:"6px"}}>
            <i className="bi bi-calendar-week" style={{ marginLeft: '5px', fontSize: "13px",marginRight:"15px"}}></i>
          </p>
        <p>
          {`${new Date(item.startDateTime).toLocaleString("fa-IR", {
            weekday: "long",
          })} ${new Date(item.startDateTime).toLocaleDateString("fa-IR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}، ${new Date(item.startDateTime).toLocaleString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </p>
        </div>
                
                <button className="buy-button" onClick={() => {
                  navigate(`/concertDetail/${item.id}`)
                  setIsLoading(true)
                  }}>
                  <i className="bi bi-bag-plus" style={{ marginLeft: '5px', fontSize: "16px" }}></i>
                  خرید بلیت
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

  );
  
};

export default Favorites;


