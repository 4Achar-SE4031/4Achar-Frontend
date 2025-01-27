import React, { useEffect, useState } from "react";
import NewReply from "./NewReply";
import "./comment.css";
import deleteIcon from "../../assets/Images/icon-delete.svg";
import editIcon from "../../assets/Images/icon-edit.svg";
import replyIcon from "../../assets/Images/icon-reply.svg";
import liked from "../../assets/Images/liked.png";
import unliked from "../../assets/Images/unliked.png";
import profile from "../../assets/Images/profile.png";
import CommentData from "./types";

interface CommentProps {
  id: number;
  currentUser: string;
  parent: number | null;
  comment: string;
  image: string;
  username: string;
  timeSince: string;
  score: number;
  replies: CommentData[]; // We'll store the *nested* children here
  updateScore: (id: number, action: "upvote" | "downvote") => void;
  updateComment: (content: string, id: number) => void;
  setDeleteComment: (id: number | false) => void;
  addNewReply: (id: number, content: string) => void;
  hasLiked: boolean;
  replyingTo: number | null | undefined;
  replyingToName: string | null | undefined;
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
  replyingTo,
  replyingToName,
}) => {
  const [newReply, setNewReply] = useState<boolean>(false);
  const [edit, setEdit] = useState<string | false>(false);

  const isAuthor = String(username) === String(currentUser);



  // Toggle reply box
  const handleReply = () => {
    setNewReply(true);
  };

  return (
    <>
      <div className="comment comment-content">
        <div className="scoreColumn">
          {isAuthor ? (
            <>
              {/* Disabled like if it's your own comment */}
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
                  if (!hasLiked) {
                    updateScore(id, "upvote");
                  } else {
                    updateScore(id, "downvote");
                  }
                }}
              />
              <span className="flex-item">{score}</span>
            </>
          )}
        </div>

        <div className="contentColumn text-right">
          <div className="commentHeader">
          <div className="userInfo">
            <div className="row align-items-center pb-3">
              <img className="avatar" src={image || profile} alt="avatar" />
              <div className="username">{username}</div>
              {isAuthor && <div className="youTag">شما</div>}
              <div className="timestamp">{timeSince}</div>
            </div>
            </div>
            <div className="actionButtons">
            {isAuthor ? (
              // If user is author, show edit/delete
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
              // Otherwise show "پاسخ دادن"
              <div className="replyButton" onClick={handleReply}>
                <img src={replyIcon} alt="reply" />
                <span> پاسخ دادن</span>
              </div>
            )}
            </div>
          </div>

          {edit !== false ? (
            <>
              <div className="updateInput">
                <textarea
                  value={edit}
                  onChange={(e) => setEdit(e.target.value)}
                  className="replyInput"
                  placeholder="ویرایش دیدگاه..."
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
              {/* If it's a reply, show mention */}
              {replyingToName && parent !== null && (
                <span className="reply-username">@{replyingToName} </span>
              )}
              {comment}
            </div>
          )}
        </div>
      </div>

      {/* If "reply" was clicked, show the new reply box */}
      {newReply && (
        <NewReply
          parentId={id}
          setNewReply={setNewReply}
          addNewReply={addNewReply}
          currentUser={currentUser}
        />
      )}

      {/* Now render the *children* (nested replies) - 
          we do NOT check replyingTo !== null */}
      {replies.map((r) => (
        <div className="commentReplies" key={r.id}>
          <div className="verticalLine"></div>
          <Comment
            id={r.id}
            currentUser={currentUser}
            parent={r.parentId ?? null}
            comment={r.text}
            image={profile} // or load from user
            username={r.username}
            timeSince={r.createdAt}
            score={r.score}
            replies={r.replies} // nested
            updateScore={updateScore}
            updateComment={updateComment}
            setDeleteComment={setDeleteComment}
            addNewReply={addNewReply}
            hasLiked={r.hasLiked}
            replyingTo={r.replyingTo}
            replyingToName={r.replyingToName}
          />
        </div>
      ))}
    </>
  );
};

export default Comment;
