import { useEffect, useState } from "react";
import NewReply from "./NewReply";
import "./comment.css";
import deleteIcon from "../../assets/Images/icon-delete.svg";
import editIcon from "../../assets/Images/icon-edit.svg";
import replyIcon from "../../assets/Images/icon-reply.svg";
import liked from "../../assets/Images/liked.png";
import unliked from "../../assets/Images/unliked.png";
import profile from "../../assets/Images/profile.png";

interface CommentProps {
  id: number;
  currentUser: string;
  parent: number;
  comment: string;
  image: string;
  username: string;
  timeSince: string;
  score: number;
  replies: Reply[];
  updateScore: (id: number, action: "upvote" | "downvote") => void;
  updateComment: (content: string, id: number) => void;
  setDeleteComment: (id: number | false) => void;
  addNewReply: (id: number, content: string) => void;
  hasLiked: boolean;
}

interface Reply extends CommentProps {
  parent: number;
  replyingTo: number;
}

const Comment: React.FC<CommentProps> = ({
  id,
  currentUser,
  parent,
  comment,
  image,
  username,
  timeSince,
  score,
  replies,
  updateScore,
  updateComment,
  setDeleteComment,
  addNewReply,
  hasLiked,
}) => {
  const [newReply, setNewReply] = useState<boolean>(false);
  const [vote, setVote] = useState<"upvote" | "downvote" | undefined>();
  const [edit, setEdit] = useState<string | false>(false);
  const [current, setCurrent] = useState<boolean>(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.profile_picture) {
    userData.profile_picture = profile;
  }

  useEffect(() => {
    setCurrent(username === currentUser);
  }, [currentUser, username]);

  return (
    <>
      <div className="comment comment-content mr-3">
        <div className="scoreColumn">
          {current ? (
            <>
              <img className="flex-item upvote disabled-upvote" src={unliked} alt="upvote" />
              <span className="flex-item">{score}</span>
            </>
          ) : (
            <>
              <img
                className="flex-item upvote"
                src={hasLiked ? liked : unliked}
                alt="upvote"
                onClick={() => {
                  if (vote !== "upvote" && !hasLiked) {
                    updateScore(id, "upvote");
                    setVote("upvote");
                  } else {
                    updateScore(id, "downvote");
                    setVote("downvote");
                  }
                }}
              />
              <span className="flex-item">{score}</span>
            </>
          )}
        </div>

        <div className="contentColumn text-right">
          <div className="commentHeader">
            <div className="row justify-content-center align-items-center pb-3">
              <img className="avatar" src={image} alt="avatar" />
              <div className="username">{username}</div>
              {current && <div className="youTag">شما</div>}
              <div className="timestamp">{timeSince}</div>
            </div>
            {current ? (
              edit !== false ? (
                <>
                  <div className="deleteButton disabled">
                    <img src={deleteIcon} alt="delete" />
                    <span> حذف</span>
                  </div>
                  <div className="editButton disabled">
                    <img src={editIcon} alt="edit" />
                    <span> ویرایش</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="deleteButton" onClick={() => setDeleteComment(id)}>
                    <img src={deleteIcon} alt="delete" />
                    <span> حذف</span>
                  </div>
                  <div className="editButton" onClick={() => setEdit(comment)}>
                    <img src={editIcon} alt="edit" />
                    <span> ویرایش</span>
                  </div>
                </>
              )
            ) : (
              <div className="replyButton" onClick={() => setNewReply(true)}>
                <img src={replyIcon} alt="reply" />
                <span> پاسخ دادن</span>
              </div>
            )}
          </div>

          {edit !== false ? (
            <>
              <div className="updateInput">
                <textarea
                  defaultValue={edit}
                  onChange={(e) => setEdit(e.target.value)}
                  className="replyInput"
                  placeholder="ثبت دیدگاه ..."
                />
              </div>

              <div className="updateRow">
                <button
                  className="updateButton"
                  onClick={() => {
                    updateComment(edit, id);
                    setEdit(false);
                  }}
                >
                  تایید
                </button>
              </div>
            </>
          ) : (
            <div className="commentContent">
              {parent > 0 && <span className="reply-username">@{parent} </span>}
              {comment}
            </div>
          )}
        </div>
      </div>

      {newReply && (
        <NewReply
          parentId={id}
          // parent={username}
          setNewReply={setNewReply}
          addNewReply={addNewReply}
          currentUser={userData}
        />
      )}

      {replies?.length > 0 &&
        replies.map((reply) => (
          <div className="commentReplies" key={reply.id}>
            <div className="verticalLine"></div>
            <Comment {...reply} currentUser={currentUser} />
          </div>
        ))}
    </>
  );
};

export default Comment;
