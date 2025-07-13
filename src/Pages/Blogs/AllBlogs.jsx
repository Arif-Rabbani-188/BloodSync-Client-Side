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
        const res = await axios.get('https://blood-sync-server-side.vercel.app/blogs?status=published');
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col mt-30 items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <p className="text-lg text-gray-700 font-medium">Fetching the latest blogs for you...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <svg className="h-8 w-8 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        <p className="text-lg text-red-600 font-semibold">{error}</p>
        <p className="text-gray-500">Please try refreshing the page or check your internet connection.</p>
      </div>
    );
  }

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
