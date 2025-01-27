import { useState } from "react";
import "./newComment.css";
import profile from "../../assets/Images/profile.png";

interface NewCommentProps {
  addNewComment: (content: string) => void;
  currentUser: { profile_picture: string };
}

const NewComment: React.FC<NewCommentProps> = ({ addNewComment, currentUser }) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleSendClick = () => {
    addNewComment(newComment);
    setNewComment(""); // Reset the input field after sending the comment
  };

  return (
    <div className="newComment">
      <div className="avatarColumn">
        <img
          className="avatarReply"
          src={profile}
          alt="current user avatar"
        />
      </div>

      <div className="inputColumn">
        <textarea
          className="replyInput"
          placeholder="ثبت دیدگاه ..."
          onChange={(e) => setNewComment(e.target.value)}
          value={newComment}
        />
      </div>

      <div className="sendColumn">
        <button className="sendButton" onClick={handleSendClick} disabled={!/\S/.test(newComment)}>
          ارسال
        </button>
      </div>
    </div>
  );
};

export default NewComment;
