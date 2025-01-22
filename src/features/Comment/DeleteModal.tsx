import { useAuth } from "../user/login/authProvider";
import "./deleteModal.css";
import axios from "axios";


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
  // axios.defaults.headers.common["Authorization"] = `JWT ${auth.token}`;

  const deleteComment = async (commentId: number) => {
    const baseUrl = `https://eventify.liara.run/comments/${commentId}/`;

    try {
      await axios.delete(baseUrl);
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
