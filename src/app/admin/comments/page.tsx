"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

interface Author {
  _id: string;
  name: string;
  email: string;
  image?: string;
  isBannedFromCommenting: boolean;
}

interface BlogInfo {
  _id: string;
  titleEn: string;
  slug: string;
}

interface Comment {
  _id: string;
  content: string;
  authorId: Author;
  blogId: BlogInfo;
  createdAt: string;
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      } else {
        toast.error("Failed to load comments");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setComments(comments.filter(c => c._id !== id));
        toast.success("Comment deleted");
      } else {
        toast.error(data.error || "Failed to delete comment");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleBanToggle = async (userId: string, isCurrentlyBanned: boolean) => {
    const action = isCurrentlyBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} this user from commenting?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // Update local state to reflect the new ban status for all comments by this user
        setComments(comments.map(c => {
          if (c.authorId._id === userId) {
            return {
              ...c,
              authorId: {
                ...c.authorId,
                isBannedFromCommenting: data.isBannedFromCommenting
              }
            };
          }
          return c;
        }));
        toast.success(data.message);
      } else {
        toast.error(data.error || `Failed to ${action} user`);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">Manage user responses and restrict abusive users.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 border-dashed">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No comments found across the site.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Comment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Blog</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          {comment.authorId.image ? (
                            <img src={comment.authorId.image} alt={comment.authorId.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xs">
                              {comment.authorId.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {comment.authorId.name}
                            {comment.authorId.isBannedFromCommenting && (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-sm">Banned</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{comment.authorId.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-sm line-clamp-2" title={comment.content}>
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {comment.blogId ? (
                        <a href={`/blog/${comment.blogId.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline line-clamp-1 max-w-[150px]" title={comment.blogId.titleEn}>
                          {comment.blogId.titleEn}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">Deleted Post</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleBanToggle(comment.authorId._id, comment.authorId.isBannedFromCommenting)}
                          className={`p-2 rounded-lg transition-colors shadow-sm border ${
                            comment.authorId.isBannedFromCommenting 
                              ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" 
                              : "bg-white text-gray-400 border-gray-200 hover:text-rose-600 hover:border-rose-200"
                          }`}
                          title={comment.authorId.isBannedFromCommenting ? "Unban User" : "Ban User from Commenting"}
                        >
                          {comment.authorId.isBannedFromCommenting ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
