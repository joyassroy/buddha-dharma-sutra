"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, User } from "lucide-react";
import toast from "react-hot-toast";

interface Author {
  _id: string;
  name: string;
  image?: string;
  isBannedFromCommenting?: boolean;
}

interface Comment {
  _id: string;
  content: string;
  authorId: Author;
  createdAt: string;
}

interface BlogInteractionsProps {
  blogId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
  isLoggedIn: boolean;
  userImage?: string | null;
}

export default function BlogInteractions({
  blogId,
  initialLikesCount,
  initialIsLiked,
  isLoggedIn,
  userImage
}: BlogInteractionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to like this insight");
      return;
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, { method: "POST" });
      const data = await res.json();
      
      if (!data.success) {
        // Revert on failure
        setIsLiked(isLiked);
        setLikesCount(likesCount);
        toast.error(data.error || "Failed to like post");
      } else {
        // Sync with server if necessary
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      // Revert on failure
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      toast.error("An error occurred");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setNewComment("");
        setComments([data.data, ...comments]);
        toast.success("Comment posted!");
      } else {
        toast.error(data.error || "Failed to post comment");
      }
    } catch (error) {
      toast.error("An error occurred while posting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      {/* Interaction Bar */}
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'}`}
        >
          <div className={`p-3 rounded-full transition-all ${isLiked ? 'bg-rose-50' : 'bg-gray-50 group-hover:bg-rose-50'}`}>
            <Heart size={24} className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400 group-hover:text-rose-500'} />
          </div>
          <span className="font-bold text-lg">{likesCount} <span className="font-normal text-sm text-gray-500 ml-1">Loves</span></span>
        </button>

        <div className="flex items-center gap-2 text-gray-500">
          <div className="p-3 rounded-full bg-gray-50">
            <MessageCircle size={24} className="text-gray-400" />
          </div>
          <span className="font-bold text-lg">{comments.length} <span className="font-normal text-sm text-gray-500 ml-1">Comments</span></span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="bg-gray-50 rounded-3xl p-6 md:p-8">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          Responses
        </h3>

        {/* Comment Input */}
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="mb-12 relative flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center text-primary">
              {userImage ? (
                <img src={userImage} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                rows={3}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-sans"
              />
              <div className="absolute bottom-3 right-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-primary text-white p-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-gray-600 mb-4 font-serif">Sign in to share your thoughts.</p>
            <a href="/login" className="inline-flex bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-700 transition-colors">
              Login to Comment
            </a>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-8">
          {isLoadingComments ? (
            <div className="text-center py-8 text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
              <MessageCircle size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-serif">No responses yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center text-primary shadow-sm">
                  {comment.authorId?.image ? (
                    <img src={comment.authorId.image} alt={comment.authorId.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold">{comment.authorId?.name?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-none p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{comment.authorId?.name || "Unknown User"}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
