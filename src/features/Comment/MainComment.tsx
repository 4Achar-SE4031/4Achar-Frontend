import React, { useState, useEffect, useRef } from "react";
import "./MainComment.css";
import axios from "axios";
import moment from "moment-timezone";

import Comment from "./Comment";
import NewComment from "./NewComment";
import DeleteModal from "./DeleteModal";
import profile from "../../assets/Images/profile.png";
import { useAuth } from "../user/login/authProvider";

interface CommentData {
  id: number;
  text: string;
  created_at: string;
  score: number;
  username: string;
  user_photo: string;
  user: number;
  liked_by: number[];
  has_liked: boolean;
  replies: CommentData[];
  event: number;
  parent?: number;
}

interface MainCommentProps {
  id: number;
}

const MainComment: React.FC<MainCommentProps> = ({ id }) => {
  const auth = useAuth();
  const [data, setData] = useState<CommentData[]>([]);
  const [deleteComment, setDeleteComment] = useState<number | false>(false);
  const [initialFetchDone, setInitialFetchDone] = useState<boolean>(false);
  const initialDataLength = useRef<number | null>(null);

  if (auth.token) {
    axios.defaults.headers.common["Authorization"] = `JWT ${auth.token}`;
  }

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    const fetchComments = async () => {
      if (!initialFetchDone && auth.token) {
        const baseUrl = `https://eventify.liara.run/events/${id}/comments/`;

        try {
          const response = await axios.get(baseUrl);
          const comments: CommentData[] = response.data.comments;
          initialDataLength.current = comments.length;
          setData(comments);

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

          comments.forEach((comment) => {
            comment.created_at = translateTime(comment.created_at);
            comment.replies.forEach((reply) => {
              reply.created_at = translateTime(reply.created_at);
            });
          });

          setData(comments);
          setInitialFetchDone(true);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      }
    };

    fetchComments();
  }, [id, initialFetchDone, auth.token]);

  const addNewComment = async (content: string) => {
    if (!/\S/.test(content)) return;

    const newComment: CommentData = {
      id: Date.now(),
      text: content,
      created_at: "Just now",
      score: 0,
      username: userData.user?.username || "",
      user_photo: userData.profile_picture || "",
      user: userData.user?.id || 0,
      liked_by: [],
      has_liked: false,
      replies: [],
      event: id,
    };

    setData((prev) => [...prev, newComment]);
    setInitialFetchDone(false);

    try {
      await axios.post("https://eventify.liara.run/comments/", {
        event: id,
        text: content,
      });
      setInitialFetchDone(true);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container-fluid mb-5 pb-5">
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
            comment={comment.text}
            // replyingTo={3}
            parent={3}
            image={comment.user_photo || profile}
            username={comment.username}
            timeSince={comment.created_at}
            score={comment.score}
            replies={comment.replies as any}
            id={comment.id}
            hasLiked={comment.has_liked}
            addNewReply={() => {}}
            updateComment={() => {}}
            setDeleteComment={setDeleteComment}
            updateScore={() => {}}
            currentUser={userData.user?.username || ""}
          />
        ))}
        {
        // userData.user 
        true ? (
          <NewComment addNewComment={addNewComment} currentUser={userData} />
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
