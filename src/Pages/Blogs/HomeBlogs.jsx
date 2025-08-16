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
  <section className="py-12 px-4 md:px-8" style={{background:"var(--color-bg)", color:"var(--color-text)"}}>
      <div className="w-11/12 md:w-10/12 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color:"var(--color-primary)"}}>
          Recent Blog Posts
        </h2>
        <p className="text-muted mb-10 max-w-2xl mx-auto">
          Explore tips, stories, and updates about blood donation and how you
          can help save lives.
        </p>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="card transition p-6 flex flex-col justify-between min-h-[380px] hover-surface"
            >
              <img
                src={blog.thumbnail}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded mb-4"
              />
              <div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-muted text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted flex items-center gap-2">
                  <FaRegCalendarAlt style={{color:"var(--color-primary)"}} />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="text-sm font-semibold hover:underline"
                  style={{color:"var(--color-primary)"}}
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
            className="btn btn-primary"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogs;
