export default interface CommentData {
  id: number;
  text: string;
  createdAt: string;
  score: number;
  userId: string;
  username: string;
  hasLiked: boolean;
  parentId?: number | null;
  eventId: number;
  replies: CommentData[];
  replyingTo?: number | null;
  replyingToName?: string | null;
}
  
  export interface CreateCommentDto {
    text: string;
    eventId: number;
    parentId?: number;
  }
  
  export interface UpdateCommentDto {
    newText: string;
  }