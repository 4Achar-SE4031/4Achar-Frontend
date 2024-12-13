import React, { useEffect, useState } from "react";
import Video from "./video2.mp4";
import { Button, ScrollButton } from "./ButtonElements";
import {
  HeroContainer,
  HeroBg,
  VideoBg,
  HeroContent,
  HeroH1,
  HeroP,
  HeroBtnWrapper,
  ArrowForward,
  ArrowRight,
} from "./HeroElements";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {

  const [hover, setHover] = useState(false);
  const [user, setUser] = useState<string | undefined | null>();
  useEffect(() => {
    setUser(localStorage.getItem("token"))
  },[localStorage])


  const onHover = () => {
    setHover(!hover)
  }

  return (
    <HeroContainer lang="fa">
      <HeroBg>
        <VideoBg autoPlay loop muted>
          <source src={Video} type="video/mp4" />
        </VideoBg>
      </HeroBg>
      <HeroContent>
        <HeroH1>با کنسرتیفای جادوی اجرای زنده را تجربه کنید</HeroH1>
        <HeroP>
          رزرو آسان بهترین کنسرت‌ها و نمایش‌های تئاتر سرتاسر ایران
        </HeroP>
        <HeroBtnWrapper>
            {!user ? (
            <Button
              to="/login"
              onMouseEnter={onHover}
              onMouseLeave={onHover}
              primary={true}
              dark={true}
              // smooth={true}
              // duration={500}
              // spy={true}
              // offset={-80}
            >
              !بزن بریم  {hover ? <ArrowForward /> : <ArrowRight />}
            </Button>
            ) :
            user && (
            <Button
              to="/events/recent"
              onMouseEnter={onHover}
              onMouseLeave={onHover}
              primary={true}
              dark={true}
              // smooth={true}
              // duration={500}
              // spy={true}
              // offset={-80}
            >
              !بزن بریم  {hover ? <ArrowForward /> : <ArrowRight />}
            </Button>
            )}


        </HeroBtnWrapper>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
