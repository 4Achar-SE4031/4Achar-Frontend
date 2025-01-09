import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../user/login/authProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
// import Wallet from "../Wallet/wallet";
import axios from "axios";
import blogo from '/concertify-logo.png';
import slogo from '/logo-small.png';
import profile from '/profile.png';
import agent from "../../app/api/agent";
import { set } from "mobx";

interface UserData {
  email?: string;
  firstName?:string;
  lastName?:string;
  userName?:string;
  profilePicture?:string;
}

const Navbar: React.FC = () => {
  const auth = useAuth();
  const [userData, setUserData] = useState<UserData | null>(
    JSON.parse(localStorage.getItem("userData") || "null")
  );
  const navigate = useNavigate();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [searchBoxText, setSearchBoxText] = useState<string>("");
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logo, setLogo] = useState(window.innerWidth > 1040 ? blogo : slogo);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false); // وضعیت باز یا بسته بودن پیشنهادات
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const mockSuggestions = ["داریوش","ابی","گوگوش","معین","هایده","مهستی","لیلا فروهر","شهرام شب‌پره","اندی","سیروان خسروی",
"احسان خواجه‌امیری","بنیامین بهادری","شادمهر عقیلی","مرتضی پاشایی","محسن یگانه","محسن چاوشی",
"محمد اصفهانی","علیرضا عصار","امیر تتلو","همایون شجریان","محمدرضا شجریان","سالار عقیلی","پرواز همای",
"رضا صادقی","حجت اشرف‌زاده","علی زندوکیلی","فرزاد فرزین","بابک جهانبخش","رضا یزدانی","مازیار فلاحی",
"علیرضا طلیسچی","سیامک عباسی","اشوان","بهزاد لیتو","سینا حجازی","یاس","هیچکس","سینا سرلک","مهدی یراحی",
"مهدی احمدوند","حامد همایون","حامد زمانی","رامین بی‌باک","مجید خراطها","امید حاجیلی","محسن ابراهیم‌زاده",
"حمید هیراد","فرزاد فرخ","ماکان بند","هوروش بند","شهاب مظفری","علی لهراسبی","آرون افشار","مجید رضوی",
"میثم ابراهیمی","پازل بند","آهنگ بند","راغب","ایوان بند","امین رستمی","محمد علیزاده","محمد معتمدی",
"رضا بهرام","افشین","علی پیشتاز","طاها شجاع‌نوری","مهراد جم","هوروش بند","کاینی بند","زانیار خسروی",
"بهنام بانی","کامران و هومن","حمید عسگری","فرامرز اصلانی","سامی بیگی","یگانه","رها اعتمادی","امید آمری",
"شروین حاجی‌پور","شهرام صولتی","ستار","پروین","آرش لباف","امیر قمی","آرمین 2AFM","مرتضی جعفرزاده",
"جواد یساری","داوود بهبودی","فریدون آسرایی","مهدی جهانی","علی خدابنده","امین بانی","شاهرخ","فرید زلاند",
"کیوان ساکت","علیرضا قربانی","مسعود صادقلو","مجید انتظاری","رامین زمانی",

  ];
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (query: string) => {
    console.log("fetching suggestions")
    try {
      // const response = await axios.get(`your-api-endpoint?query=${query}`);
      // setSuggestions(response.data);
      const filteredSuggestions = mockSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions(filteredSuggestions.slice(0,5));
      console.log("Filtered Suggestions:", suggestions);  // چاپ فیلتر شده‌ها

    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
    
  };
  
  useEffect(() => {
    console.log("------------------")
    console.log("user data: "+ userData)
    console.log("token: "+ auth.token)
  },[]);
  useEffect(() => {
    console.log("Updated Suggestions:", suggestions);
  }, [suggestions]);
  
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "null");
    setUserData(storedUserData);
    
    if (auth.token) {
      if (!isLoggedIn) {
        const fetchUserData = async () => {
          try {
            const response = await axios.get<UserData>("https://api-concertify.darkube.app/account/me/", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${auth.token}`,
              },
            });
            console.log(response)
            localStorage.setItem("userData", JSON.stringify(response.data));
            setUserData(response.data);
            setIsLoggedIn(true);
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              auth.logOut();
            }
          }
        };

        fetchUserData();
      }
    } else {
      setIsLoggedIn(false);
    }

    const handleResize = () => {
      if (window.innerWidth > 1040) {
        setLogo(blogo)
      }else{
        setLogo(slogo)
      }
      if (window.innerWidth > 630) {
        setShowDrawer(false);
        setShowBorder(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [auth, isLoggedIn, isOpen]);

  const handleShowDrawer = () => {
    
    setShowDrawer(!showDrawer);
    if (!showBorder) {
      setTimeout(() => setShowBorder(!showBorder), 300);
    } else {
      setShowBorder(!showBorder);
    }
  };

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchBoxText(query);
    if (query === "") {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      setSelectedIndex(0);
      return;
    }
    await fetchSuggestions(query);
    console.log("rad shod")
    if(suggestions.length==0){
      setIsSuggestionsOpen(false);
      console.log("rad shod2222")
    }else{
      setIsSuggestionsOpen(true);
      console.log("rad shod3333")
    }
  };
  
  const searchHandler = (query: string) => {
    console.log("searching: "+ query);
  };

     // تابعی برای بستن پیشنهادات
  const closeSuggestions = () => {
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    setSelectedIndex(0);
  };

  // اثر برای اضافه کردن event listener برای کلیک‌های خارج از بخش پیشنهادات
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // پاک کردن event listener هنگام unmount شدن کامپوننت
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed: " + selectedIndex);
  
    if (suggestions.length === 0) return;
    
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); // جلوگیری از جابجایی مکان‌نما در search box
  
      if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) => {
          const newIndex = prevIndex === null ? 0 : (prevIndex + 1) % suggestions.length;
          return newIndex;
        });
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prevIndex) => {
          const newIndex = prevIndex === null ? suggestions.length - 1 : (prevIndex - 1 + suggestions.length) % suggestions.length;
          return newIndex;
        });
      }
    } else if (e.key === "Enter" && selectedIndex !== null) {
      const selectedSuggestion = suggestions[selectedIndex];
      setSearchBoxText(selectedSuggestion);
      searchHandler(selectedSuggestion);
      setSelectedIndex(0);
      closeSuggestions();
    }
  };
  
  

  return (
    <nav className="navbar">
      <div className="container">
        <div>
          <NavLink to="/home">
            <img
              className="logo"
              src={logo}
              style={{ paddingBottom: "15px" }}
              alt="Logo"
            />
          </NavLink>
        </div>
        <div className="centered-column" ref={suggestionsRef}>
          <div className="col" style={{paddingLeft:"0px", paddingRight:"0px"}}>
            <div className={`search-bar ${isSuggestionsOpen && suggestions.length > 0 ? "open" : ""}`} >
              <input
                type="text"
                placeholder="جستجو..."
                className="search-input"
                value={searchBoxText}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown} // اضافه کردن رویداد

              />
              <button className="search-button" onClick={() => {
                          searchHandler(searchBoxText);
                        }}>
                <p className="bi bi-search search-icon"></p>
              </button>
            </div>
            <div style={{paddingLeft:"15px", paddingRight:"15px"}}>
            <div className="suggestions-container" >
              {isSuggestionsOpen && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                    key={index}
                    className={`suggestion-item ${
                      index === selectedIndex ? "selected" : ""
                    }`}
                    style={{
                      fontFamily: "iransansweb",
                      backgroundColor: index === selectedIndex ? "#f9d966" : "#fef9e5", // استایل برجسته
                      display: "flex", // چینش افقی
                      justifyContent: "space-between", // فاصله بین آیکون و متن
                      alignItems: "center", // هم‌تراز کردن متن و آیکون
                      padding: "8px", // فضای داخلی برای آیتم‌ها
                    }}
                    onClick={() => {
                      setSearchBoxText(suggestion);
                      searchHandler(suggestion);
                      closeSuggestions();
                    }}
                  >
                    {/* متن پیشنهاد */}
                    <span style={{ flex: 1, textAlign: "right" }}>{suggestion}</span>
                  
                    {/* آیکون سمت چپ */}
                    <span
                      className="bi bi-chevron-left"
                      style={{
                        marginLeft: "15px", // فاصله از متن
                        fontSize: "1.2rem", // اندازه آیکون
                        color: "#666", // رنگ آیکون
                      }}
                    ></span>
                  </li>
                  ))}
                </ul>
              )}
            </div>
            </div>
          </div>
        </div>

        
        

        <div className="menu-icon" onClick={handleShowDrawer}>
          <i className="bi bi-list" style={{ fontSize: "28px", paddingBottom: "15px" }}></i>
        </div>

        <div className={`nav-elements ${showDrawer && "active"}`}>
          <ul>
            {/* {!showDrawer && auth.token && (
              <li>
                <Wallet balance={userData?.balance || 0} />
              </li>
            )} */}
            <li>
              <NavLink to="/home" >خانه</NavLink>
            </li>
            <li>
              <NavLink to="/create-event">ویترین</NavLink>
            </li>
            <li>
              <NavLink to="/create-event"> خرید ها</NavLink>
            </li>
            {/* <li>
              <NavLink to="/create-event">ایجاد کنسرت </NavLink>
            </li> */}
            
            {!showDrawer && !auth.token && showBorder && (
              <div className="auth-link">
                  <NavLink to="/register" style={{marginLeft:"30px",marginBottom:"3px",marginRight:"13px"}}>عضویت</NavLink>
                
                <li className="auth-link-li">
                  <NavLink to="/login">ورود</NavLink>
                </li>
              </div>
            )}

                {!showDrawer && auth.token && 
                        <div className="dropdown-container" onMouseEnter={() => setIsOpen(true)}>
                        
                        <div className="row" >
                            {userData && <p className="pt-2 px-2 ellipsis"> {userData.userName}</p>}
                            {/* {userData!.profilePicture && <img src={userData!.profilePicture} style={{height:"40px",width:"40px",borderRadius: "50%"  }} alt="profile"/>}
                            {!userData!.profilePicture && <img src={profile} style={{height:"40px",width:"40px",borderRadius: "50%"  }} alt="profile"/>} */}
                            
                            {userData?.profilePicture ? (
                                <img
                                  src={userData.profilePicture}
                                  style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                                  alt="profile"
                                />
                              ) : (
                                <img
                                  src={profile}
                                  style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                                  alt="profile"
                                />
                            )}
                        </div>
                          
                        
                        {isOpen && (
                          <div className="col dropdown-contentt">
                            {/* <div className="row"> ردیف 1</div>
                            <div className="row"> ردیف 2</div> */}
                                <div className="row pr-2 pt-2  dropdown-item1" onClick={() =>navigate('/user-info')}>
                                        <i className="pl-1 ml-0  uil uil-user"></i>
                                        <p className="pt-0 mb-0">حساب کاربری</p>
                                </div>
                                <div className="row pr-2 dropdown-item2" >
                                        <i className=" pl-2 pr-1 mt-1 bi bi-box-arrow-right"></i>
                                          <p className="mt-1" onClick={() => {
                                toast.error("از حساب کاربری خارج شدید")
                                setTimeout(() => {
                                    auth.logOut()
                                    setIsLoggedIn(false)
                                  }, 4000);
                            }}>خروج </p>

                                </div>
                        </div>
                        
                        )}
                        </div>
                }

            {showDrawer && !auth.token && (
              <>
                <li className="auth-link-li-drawer">
                  <NavLink to="/login">ورود</NavLink>
                </li>
                <li className="auth-link-li-drawer">
                  <NavLink to="/register">عضویت</NavLink>
                </li>
              </>
            )}

            {showDrawer && auth.token && (
              <>
                <li className="auth-link-li">
                  <NavLink to="/user-info">حساب کاربری</NavLink>
                </li>
                {/* <li className="auth-link-li" style={{ marginRight: "15px" }}>
                  <Wallet balance={userData?.balance || 0} />
                </li> */}
                <li
                  className="auth-link-li pb-1"
                  onClick={() => {
                    toast.error("از حساب کاربری خارج شدید");
                    setTimeout(() => {
                      auth.logOut();
                      setIsLoggedIn(false);
                    }, 4000);
                  }}
                >
                  خروج
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
