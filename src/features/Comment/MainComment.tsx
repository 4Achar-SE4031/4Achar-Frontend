// MainComment.tsx

import React, { useState, useEffect, useRef } from "react";
import "./MainComment.css";
import axios from "axios";
import moment from "moment-timezone";

import Comment from "./Comment";
import NewComment from "./NewComment";
import DeleteModal from "./DeleteModal";
import profile from "../../assets/Images/profile.png";
import { useAuth } from "../user/login/authProvider";
import CommentData from "./types"; // Correct default import

interface MainCommentProps {
  id: number;
}

const MainComment: React.FC<MainCommentProps> = ({ id }) => {
  const auth = useAuth();

  const [data, setData] = useState<CommentData[]>([]);
  const [deleteComment, setDeleteComment] = useState<number | false>(false);
  const [initialFetchDone, setInitialFetchDone] = useState<boolean>(false);
  const initialDataLength = useRef<number | null>(null);

  // If auth.token exists, apply the Authorization header
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    }
  }, [auth.token]);

  // Attempt to parse user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  console.log("User Data:", userData);

  // ---------------------------------------------------------------------------------------
  // EFFECT: Fetch Comments on Mount (if token exists)
  // ---------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchComments = async () => {
      // Only fetch if we haven't fetched yet and we have a token
      if (!initialFetchDone && auth.token) {
        const baseUrl = `https://api-concertify.darkube.app/api/comments/event/${id}`;

        try {
          const response = await axios.get(baseUrl);
          console.log("API Response:", response.data);
          const comments: CommentData[] = response.data.comments;

          initialDataLength.current = comments.length;

          // Group replies under their respective parent comments using 'parentId'
          const commentMap = new Map<number, CommentData>();
          const topLevelComments: CommentData[] = [];

          comments.forEach((comment) => {
            commentMap.set(comment.id, { ...comment, replies: [] });
          });

          comments.forEach((comment) => {
            if (comment.replyingTo != null) {
              const parent = commentMap.get(comment.replyingTo);
              if (parent) {
                parent.replies.push(commentMap.get(comment.id)!);
              }
            } else {
              topLevelComments.push(commentMap.get(comment.id)!);
            }
          });

          // Translate timestamps
          const translateTime = (time: string): string => {
            let translatedTime = moment.utc(time).local().fromNow();
            const translations: Record<string, string> = {
              ago: "قبل",
              "a few seconds": "لحظاتی",
              days: "روز",
              an: "یک",
              a: "یک",
              day: "روز",
              months: "ماه",
              month: "ماه",
              years: "سال",
              year: "سال",
              weeks: "هفته",
              week: "هفته",
              minutes: "دقیقه",
              minute: "دقیقه",
              hours: "ساعت",
              hour: "ساعت",
              seconds: "ثانیه",
              few: "چند",
            };

            for (const key in translations) {
              if (translatedTime.includes(key)) {
                translatedTime = translatedTime.replace(key, translations[key]);
              }
            }
            return translatedTime;
          };

          // Adjust timestamps for each comment & reply
          // groupedComments.forEach((comment) => {
          //   comment.createdAt = translateTime(comment.createdAt);
          //   comment.replies.forEach((reply) => {
          //     reply.createdAt = translateTime(reply.createdAt);
          //   });
          // });

          // setData(groupedComments);
          const translateTimeForComment = (comment: CommentData) => {
  comment.createdAt = translateTime(comment.createdAt);
  comment.replies.forEach(translateTimeForComment);
};
topLevelComments.forEach(translateTimeForComment);

setData(topLevelComments);
          setInitialFetchDone(true);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    };

    fetchComments();
  }, [id, initialFetchDone, auth.token]);

  // ---------------------------------------------------------------------------------------
  // HELPER BACKEND CALLS for CREATE, UPDATE, LIKE, REPLY
  // ---------------------------------------------------------------------------------------
  const addNewCommentBack = async (content: string) => {
    try {
      console.log("Sending POST request to add new comment...");
      const baseUrl = "https://api-concertify.darkube.app/api/comments";
      const response = await axios.post(baseUrl, {
        eventId: id,
        text: content,
      });
      console.log("New comment added:", response.data);

      // Update the local state with the created comment from the backend
      const newComment: CommentData = response.data;
      setData((prevData) => [...prevData, { ...newComment, replies: [] }]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const updateCommentBack = async (commentId: number, updatedContent: string) => {
    try {
      console.log(`Sending PUT request to update comment ID ${commentId}...`);
      const baseUrl = `https://api-concertify.darkube.app/api/comments/${commentId}`;
      const response = await axios.put(baseUrl, {
        newText: updatedContent,
      });
      console.log(`Comment ID ${commentId} updated:`, response.data);

      // Update the local state with the updated comment
      setData((prevData) =>
        prevData.map((comment) =>
          comment.id === commentId
            ? { ...comment, text: updatedContent }
            : {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId ? { ...reply, text: updatedContent } : reply
              ),
            }
        )
      );
    } catch (error) {
      console.error(`Error updating comment ID ${commentId}:`, error);
    }
  };

  const updateScoreBack = async (commentId: number) => {
    try {
      console.log(`Sending POST request to toggle like for comment ID ${commentId}...`);
      const baseUrl = `https://api-concertify.darkube.app/api/comments/${commentId}/toggle-like`;
      const response = await axios.post(baseUrl);
      console.log(`Like toggled for comment ID ${commentId}:`, response.data);

      // Update the local state based on the response
      setData((prevData) =>
        prevData.map((comment) =>
          comment.id === commentId
            ? {
              ...comment,
              hasLiked: response.data.hasLiked,
              score: response.data.score,
            }
            : {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                    ...reply,
                    hasLiked: response.data.hasLiked,
                    score: response.data.score,
                  }
                  : reply
              ),
            }
        )
      );
    } catch (error) {
      console.error(`Error toggling like for comment ID ${commentId}:`, error);
    }
  };

  const addNewReplyBack = async (parentId: number, content: string) => {
    try {
      console.log(`Sending POST request to add reply to comment ID ${parentId}...`);
      const baseUrl = "https://api-concertify.darkube.app/api/comments";
      const response = await axios.post(baseUrl, {
        eventId: id,
        text: content,
        parentId: parentId,
      });
      console.log(`Reply added to comment ID ${parentId}:`, response.data);

      // Update the local state with the created reply from the backend
      const newReply: CommentData = response.data;
      setData((prevData) =>
        prevData.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
    } catch (error) {
      console.error(`Error adding reply to comment ID ${parentId}:`, error);
    }
  };

  // ---------------------------------------------------------------------------------------
  // LOCAL STATE UPDATES
  // ---------------------------------------------------------------------------------------
  const updateScore = (commentId: number, action: "upvote" | "downvote") => {
    console.log(`updateScore called for comment ID ${commentId} with action ${action}`);
    const temp = [...data];

    for (const comment of temp) {
      if (comment.id === commentId) {
        if (action === "upvote") {
          comment.score += 1;
          comment.hasLiked = true;
        } else {
          comment.score -= 1;
          comment.hasLiked = false;
        }
        updateScoreBack(commentId);
        break;
      }
      if (comment.replies.length > 0) {
        for (const reply of comment.replies) {
          if (reply.id === commentId) {
            if (action === "upvote") {
              reply.score += 1;
              reply.hasLiked = true;
            } else {
              reply.score -= 1;
              reply.hasLiked = false;
            }
            updateScoreBack(commentId);
            break;
          }
        }
      }
    }
    setData(temp);
  };

  const updateComment = (updatedContent: string, commentId: number) => {
    console.log(`updateComment called for comment ID ${commentId} with content "${updatedContent}"`);
    const temp = [...data];

    for (const comment of temp) {
      if (comment.id === commentId) {
        comment.text = updatedContent;
        updateCommentBack(commentId, updatedContent);
        break;
      }
      if (comment.replies.length > 0) {
        for (const reply of comment.replies) {
          if (reply.id === commentId) {
            reply.text = updatedContent;
            updateCommentBack(commentId, updatedContent);
            break;
          }
        }
      }
    }

    setData(temp);
  };

  const addNewReply = (parentId: number, content: string) => {
    console.log(`addNewReply called with parentId: ${parentId}, content: "${content}"`);
    if (!/\S/.test(content)) return;

    // Optimistic UI update: add reply to local state immediately
    const temp = [...data];
    const findAndAddReply = (comments: CommentData[]): boolean => {
      for (const comment of comments) {
        if (comment.id === parentId) {
          const newReply: CommentData = {
            id: Date.now(), // Temporary ID; backend should provide a real one
            text: content,
            createdAt: moment().toISOString(),
            score: 0,
            userId: userData.userId || "", // Adjust based on userData structure
            username: userData.username || "",
            hasLiked: false,
            parentId: parentId,
            eventId: id,
            replies: [],
            replyingTo: parentId,
            replyingToName: comment.username,
          };
          comment.replies.push(newReply);
          console.log("Added new reply to local state:", newReply);
          return true;
        }
        if (comment.replies.length > 0) {
          if (findAndAddReply(comment.replies)) {
            return true;
          }
        }
      }
      return false;
    };

    findAndAddReply(temp);
    setData(temp);

    // Send the reply to the backend
    addNewReplyBack(parentId, content);
  };

  // Create a new top-level comment
  const addNewComment = async (content: string) => {
    console.log(`addNewComment called with content: "${content}"`);
    if (!/\S/.test(content)) {
      console.log("Comment content is empty. Not adding comment.");
      return;
    }

    // Optimistic UI update: add comment to local state
    const newComment: CommentData = {
      id: Date.now(), // Temporary ID; backend should provide a real one
      text: content,
      createdAt: moment().toISOString(),
      score: 0,
      userId: userData.userId || "",
      username: userData.username || "",
      hasLiked: false,
      parentId: null,
      eventId: id,
      replies: [],
      replyingTo: null,
      replyingToName: null,
    };

    setData((prevData) => [...prevData, newComment]);
    console.log("Added new comment to local state:", newComment);

    // Send the new comment to the backend
    await addNewCommentBack(content);
  };

  // ---------------------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------------------
  return (
    <div className="container-fluid mb-5 pb-5" lang="fa">
      <div className="row">
        <div className="col-6 mx-auto">
          <div className="comment-section-title text-center">
            <h1>نظرات</h1>
          </div>
        </div>
      </div>

      {deleteComment && (
        <DeleteModal
          id={deleteComment}
          setDeleteComment={setDeleteComment}
          setData={setData}
          data={data}
          setInitialFetchDone={setInitialFetchDone}
        />
      )}

      <main className="comments-column">
        {data.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            comment={comment.text}
            parent={comment.parentId ?? null} // Allow null for top-level comments
            image={profile} // Assuming a URL to user photo
            username={comment.username}
            timeSince={comment.createdAt}
            score={comment.score}
            replies={comment.replies}
            updateScore={updateScore}
            updateComment={updateComment}
            setDeleteComment={setDeleteComment}
            addNewReply={addNewReply}
            hasLiked={comment.hasLiked}
            currentUser={userData.userName || ""}
            replyingTo={comment.replyingTo}
            replyingToName={comment.replyingToName}
          />
        ))}

        {/* If the user is logged in, show the new comment form; otherwise, prompt to login */}
        {userData ? (
          <NewComment addNewComment={addNewComment} currentUser={userData.userName} />
        ) : (
          <div className="row">
            <div className="col-7 mx-auto">
              <h2 id="login-comment" className="text-center mt-5">
                جهت ارسال نظر، ابتدا <a href="/login">وارد شوید.</a>
              </h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainComment;
