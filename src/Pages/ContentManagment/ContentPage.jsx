import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import useUserRole from '../../Hooks/useUserRole';


const ContentPage = () => {
  const { user } = useContext(AuthContext);
  const { role } = useUserRole();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('https://blood-sync-server-side.vercel.app/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error('Failed to fetch blogs:', err));
  }, []);

  const filteredBlogs = filter === 'all' ? blogs : blogs.filter(blog => blog.status === filter);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://blood-sync-server-side.vercel.app/blogs/${id}`);
        setBlogs(prev => prev.filter(blog => blog._id !== id));
        Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Failed', 'Could not delete blog.', 'error');
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${newStatus} this blog?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus} it!`
    });

    if (confirm.isConfirmed) {
      try {
        const updated = await axios.patch(`https://blood-sync-server-side.vercel.app/blogs/${id}`, { status: newStatus });
        setBlogs(prev => prev.map(blog => blog._id === id ? { ...blog, status: newStatus } : blog));
        Swal.fire('Success', `Blog status updated to ${newStatus}.`, 'success');
      } catch (error) {
        Swal.fire('Failed', 'Could not update blog status.', 'error');
      }
    }
  };

  return (
    <div className="p-6 w-full md:w-10/12 md:ml-80 mx-auto mt-20 md:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button
          onClick={() => navigate('/dashboard/content-management/add-blog')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Blog
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map(blog => (
          <div key={blog._id} className="flex flex-col justify-between border rounded shadow p-4 bg-white">
            <img src={blog.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover rounded mb-2" />
            <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Status: <span className={`font-medium ${blog.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>{blog.status}</span></p>
            <p className='text-sm text-gray-500'>Author: {blog.author || "Unknown"}</p>
            <p className='text-sm text-gray-500'>Author Mail: {blog.authorEmail || "Unknown"}</p>

            {role === 'admin' && (
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => toggleStatus(blog._id, blog.status)}
                  className="text-sm px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  {blog.status === 'draft' ? 'Publish' : 'Unpublish'}
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
            <button
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="mt-2 text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
                View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;