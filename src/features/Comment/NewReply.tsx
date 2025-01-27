// NewReply.tsx

import React, { useState } from "react";
import "./newComment.css";
import profile from "../../assets/Images/profile.png";

interface NewReplyProps {
  parentId: number;
  setNewReply: (state: boolean) => void;
  addNewReply: (parentId: number, content: string) => void;
  currentUser: string; // Passed as string
}

const NewReply: React.FC<NewReplyProps> = ({
  parentId,
  setNewReply,
  addNewReply,
  currentUser,
}) => {
  const [reply, setReply] = useState<string>(""); // Use state to manage reply content

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = () => {
    console.log("Submitting reply:", reply);
    if (/\S/.test(reply)) { // Ensure reply is not empty
      addNewReply(parentId, reply);
      setReply(""); // Clear the textarea
      setNewReply(false);
      console.log("Reply submitted and form closed.");
    } else {
      console.log("Reply content is empty. Submission aborted.");
    }
  };

  return (
    <div className="newComment">
      <div className="avatarColumn">
        <img
          className="avatarReply"
          src={profile} // Using default profile since currentUser is a string
          alt="current user avatar"
        />
      </div>

      <div className="inputColumn">
        <textarea
          className="replyInput"
          placeholder="ثبت دیدگاه"
          value={reply}
          onChange={handleReplyChange}
        />
      </div>

      <div className="sendColumn">
        <button
          className="sendButton"
          onClick={handleReplySubmit}
          disabled={!/\S/.test(reply)} // Disable button if reply is empty
        >
          پاسخ دادن
        </button>
      </div>
    </div>
  );
};

export default NewReply;
