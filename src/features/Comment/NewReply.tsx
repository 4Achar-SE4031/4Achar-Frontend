import "./newComment.css";

interface NewReplyProps {
  parentId: number;
  setNewReply: (state: boolean) => void;
  addNewReply: (parentId: number, content: string) => void;
  currentUser: { profile_picture: string };
}

const NewReply: React.FC<NewReplyProps> = ({ parentId, setNewReply, addNewReply, currentUser }) => {
  let reply: string;

  return (
    <div className="newComment">
      <div className="avatarColumn">
        <img className="avatarReply" src={currentUser.profile_picture} alt="current user avatar" />
      </div>

      <div className="inputColumn">
        <textarea
          className="replyInput"
          placeholder="ثبت دیدگاه"
          onChange={(e) => {
            reply = e.target.value;
          }}
        />
      </div>

      <div className="sendColumn">
        <button
          className="sendButton"
          onClick={() => {
            addNewReply(parentId, reply);
            setNewReply(false);
          }}
        >
          پاسخ دادن
        </button>
      </div>
    </div>
  );
};

export default NewReply;
