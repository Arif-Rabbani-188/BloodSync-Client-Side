import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/blogs?status=published');
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading blogs...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-11/12 mt-20 md:mt-30 mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blogs</h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {blogs.map(blog => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{blog.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3" 
                 dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}
              />
              <div className="mt-auto">
                <Link
                  to={`/blogs/${blog._id}`}
                  className="inline-block text-blue-600 hover:underline font-medium"
                >
                  Read More &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No published blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
