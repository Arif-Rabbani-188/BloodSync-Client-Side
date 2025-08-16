import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";

const HomeBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("axios").then(({ default: axios }) => {
      axios
        .get("https://blood-sync-server-side.vercel.app/blogs?status=published")
        .then((res) => {
          const sorted = [...res.data]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
          setBlogs(sorted);
          setLoading(false);
        })
        .catch(() => {
          setBlogs([]);
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="loader border-8 border-t-8 border-red-200 h-16 w-16 rounded-full animate-spin border-t-red-600"></div>
      </div>
    );
  }

  return (
    <section className="bg-white py-12 px-4 md:px-8">
      <div className="max-w-11/12 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-700">
          Recent Blog Posts
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Explore tips, stories, and updates about blood donation and how you
          can help save lives.
        </p>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
        className="bg-red-50 hover:bg-red-100 transition p-6 rounded-xl shadow-md border border-red-100 flex flex-col justify-between min-h-[380px]"
            >
              <img
                src={blog.thumbnail}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded mb-4"
              />
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaRegCalendarAlt className="text-red-600" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/blogs/${blog._id}`}
          className="text-sm text-red-600 hover:underline font-semibold"
                >
          See more →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/blogs"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogs;
