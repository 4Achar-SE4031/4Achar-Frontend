import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./organizer-contact-info.css";
import Picker from "emoji-picker-react";
// import Picker from '@emoji-mart/react'
// import EmojiPicker from "./emojiPicker"
import EmojiModal from "./emojiPicker";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../Authentication/authProvider";

type OrganizerInfoModalProps = {
  show: boolean;
  handleClose: () => void;
  email: string;
  phone: string;
  id?: number;
};

const OrganizerInfoModal: React.FC<OrganizerInfoModalProps> = ({ show, handleClose, email, phone, id }) => {
  const auth = useAuth();
  const navigator = useNavigate();
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [input, setInput] = useState("");
  const [placeHolder, setPlaceHolder] = useState("پیام خود را وارد کنید...");

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: string[] = [];
    sym.forEach((el:any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray as any);
    setInput(input + emoji);
  };

  const pasteClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Handle clipboard paste here
  };

  const sendMessageHandler = async () => {
    if (id === undefined) {
        // Handle the case where id is undefined
        console.error("Recipient ID is undefined");
        return;
      }
      
    let sendingMessage = {
      content: input,
      recipient: id.toString(),
    };
    console.log("sending message:", sendingMessage);
    try {
      let response = await axios.post('https://eventify.liara.run/messages/', sendingMessage, {
        headers: {
          Authorization: `JWT ${auth.token}`,
        }
      });
      console.log('Message sent successfully');

      toast.success('پیام شما برای برگزارکننده ارسال شد', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        autoClose: 3000,
        style: { backgroundColor: "#2b2c38", fontFamily: "iransansweb", color: "#ffeba7", marginTop: "60px" }
      });
      setIsInputDisabled(true);
      const inputted_text = input;
      setInput("");
      setPlaceHolder("میتوانید گفت و گو را از صفحه پروفایل ادامه دهید");
      // setTimeout(() => {
      //     navigator('/chat');
      // }, 2500);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} style={{ paddingTop: "15%", direction: "rtl" }}>
      <Modal.Header>
        <Modal.Title>اطلاعات تماس با برگزارکننده</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row text-right">
          <div className="col">
            تلفن: {phone}
          </div>
          <div className="col">
            ایمیل: {email}
          </div>
        </div>
        {/* <EmojiModal onSelect={addEmoji}/> */}

        <div id="chat">
          <div className="chat__conversation-panel">
            <div className="chat__conversation-panel__container">
              {<button className="chat__conversation-panel__button panel-item btn-icon emoji-button" onClick={pasteClipboard}>
                <i className="bi bi-clipboard"></i>
              </button>}
              <input className="chat__conversation-panel__input panel-item"
                id="chat__conversation-panel__input"
                placeholder={placeHolder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                disabled={isInputDisabled} />
              <button className="chat__conversation-panel__button panel-item btn-icon send-message-button"
                onClick={sendMessageHandler}
                disabled={isInputDisabled}>
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
              {/* {showEmojis && showEmojiPicker()} */}
            </div>
          </div>
        </div>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          بستن
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrganizerInfoModal;
