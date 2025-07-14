import React, { use, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import auth from '../../../Firebase/firebase.init';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const AddBlogs = () => {
    const {user} = use(AuthContext);
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    content: '',
  });
  const [uploading, setUploading] = useState(false);

  const axiosSecure = useAxiosSecure();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const imageForm = new FormData();
    imageForm.append('image', file);

    const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, imageForm);
      const imageUrl = res.data.data.display_url;
      setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
      Swal.fire('Success', 'Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload failed:', error);
      Swal.fire('Error', 'Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.thumbnail || !formData.content) {
      Swal.fire('Incomplete', 'Please fill in all fields', 'warning');
      return;
    }

    try {
      const blogData = {
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        author: user?.displayName || 'Anonymous',
        authorEmail: user?.email,
      };

      const response = await axiosSecure.post('/blogs', blogData);
      if (response.data.insertedId || response.data.acknowledged) {
        Swal.fire('Success!', 'Blog created in draft status.', 'success');
        setFormData({ title: '', thumbnail: '', content: '' });
      }
    } catch (error) {
      console.error('Blog creation failed:', error);
      Swal.fire('Error', 'Blog creation failed', 'error');
    }
  };

  return (
    <div className="p-6 w-full md:w-10/12 md:ml-80 mx-auto mt-20 md:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Blog</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
          {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
          {formData.thumbnail && (
            <img src={formData.thumbnail} alt="Thumbnail" className="mt-4 w-48 rounded border" />
          )}
        </div>

        {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Content</label>
              <JoditEditor
                ref={editor}
                value={formData.content}
                tabIndex={1}
                onBlur={handleContentChange}
                config={{
                  height: 500, // Increased height (default is 300)
                }}
              />
            </div>

            {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            Create Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogs;
