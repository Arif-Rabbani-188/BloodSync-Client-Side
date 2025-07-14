import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const SingleBlog = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");

  const {
    data: blog,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axios.get(
        `https://blood-sync-server-side.vercel.app/blogs/${id}`
      );
      return res.data;
    },
    enabled: !!id,
  });

  const handleLike = async () => {
    try {
      await axios.patch(
        `https://blood-sync-server-side.vercel.app/blogs/${id}/like`,
        {
          email: user.email,
        }
      );
      refetch();
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      user: user.displayName || "Anonymous",
      email: user.email,
      photoURL: user.photoURL || "",
      message: commentText,
      date: new Date(),
    };

    try {
      await axios.patch(
        `https://blood-sync-server-side.vercel.app/blogs/${id}/comment`,
        newComment
      );
      setCommentText("");
      refetch();
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleDeleteComment = async (comment) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`https://blood-sync-server-side.vercel.app/blogs/${id}/comment`, {
        data: {
          email: comment.email,
          message: comment.message,
        },
      });
      refetch();
      Swal.fire("Deleted!", "Your comment has been deleted.", "success");
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire("Error", "Failed to delete comment.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading blog...</p>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600 text-lg">Failed to load blog.</p>
      </div>
    );
  }

  const {
    title,
    content,
    thumbnail,
    author,
    authorEmail,
    likes = 0,
    likedBy = [],
    comments = [],
  } = blog;

  const hasLiked = likedBy.includes(user?.email);

  return (
    <div className="max-w-6xl mt-20 mx-auto px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-72 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
          <p className="mb-1 text-sm text-gray-500">
            Author: {author || "Unknown"}
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Email: {authorEmail || "Unknown"}
          </p>

          <div
            className="prose prose-lg max-w-none text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Like Button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`px-4 py-1 rounded text-white ${
                hasLiked
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {hasLiked ? "💔 Unlike" : "❤️ Like"}
            </button>
            <span className="ml-3 text-gray-700">{likes} likes</span>
          </div>

          {/* Comment Form */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Add a Comment</h2>
            {user ? (
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mb-2"
                  placeholder="Write your comment..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-red-500 text-sm">
                Please{" "}
                <a href="/login" className="text-blue-500 underline">
                  login
                </a>{" "}
                to comment.
              </p>
            )}
          </div>

          {/* Comment List */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2 border-gray-300">
              Comments
            </h2>
            {comments.length === 0 ? (
              <p className="text-gray-400 italic">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <ul className="space-y-6 max-h-96 overflow-y-auto">
                {comments.map((comment, idx) => {
                  const canDelete = user?.email === comment.email;

                  return (
                    <li
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={comment.photoURL || "/userLogo.jpg"}
                        alt={`${comment.user}'s avatar`}
                        className="w-15 h-15 rounded-full object-cover border border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-2 select-none">
                          By{" "}
                          <span className="font-medium text-black">
                            {comment.email}
                          </span>
                        </p>
                        <p className="font-semibold text-gray-900 mb-2 leading-snug">
                          {comment.message}
                        </p>

                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 mb-2 select-none">
                            on{" "}
                            <time dateTime={comment.date}>
                              {new Date(comment.date).toLocaleDateString()} at{" "}
                              {new Date(comment.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                          </p>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment)}
                              className="inline-block text-red-600 hover:text-red-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                              aria-label="Delete comment"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
