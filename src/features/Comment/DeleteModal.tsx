// DeleteModal.tsx
import React from "react";
import { useAuth } from "../user/login/authProvider";
import "./deleteModal.css";
import agent from "../../app/api/agent";

interface DeleteModalProps {
  id: number;
  setDeleteComment: (state: any) => void;
  setData: (data: any[]) => void;
  data: any[];
  setInitialFetchDone: (state: boolean) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  id,
  setDeleteComment,
  setData,
  data,
  setInitialFetchDone,
}) => {
  const auth = useAuth();
  // agent.Comments هم توکن را از interceptor مدیریت می‌کند

  const deleteComment = async (commentId: number) => {
    try {
      await agent.Comments.deleteComment(commentId);
      setDeleteComment(false);
      setData(data);
      setInitialFetchDone(false);
      setTimeout(() => {
        setInitialFetchDone(true);
      }, 2000);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="modalBackground">
      <div className="deleteModal text-right">
        <div className="modalTitle">حذف دیدگاه</div>
        <div>
          آیا مطمئنید که می‌خواهید این دیدگاه را حذف کنید؟ با این کار دیدگاه حذف
          می‌شود و قابل بازگشت نیست.
        </div>
        <div className="buttonsRow">
          <span id="cancel" onClick={() => setDeleteComment(false)}>
            نه، لغو
          </span>
          <span id="confirm" onClick={() => deleteComment(id)}>
            بله، حذف
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
