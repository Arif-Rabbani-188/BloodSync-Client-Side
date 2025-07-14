import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosSecure.get(`/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        setError('Blog not found or failed to load.');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  const { title, content, thumbnail, status } = blog;

  return (
    <div className="max-w-6xl mt-20 md:mt-30 mx-auto px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-72 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>

          <p className="mb-1 text-sm text-gray-500">
            Author:{' '}{blog.author || 'Unknown'}
          </p>
          <p className="mb-4 text-sm text-gray-500">
            Email:{' '}{blog.authorEmail || 'Unknown'}
          </p>

          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
