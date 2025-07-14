import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const RequestViewDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName: name, email } = user || {};

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get(`/donationRequestById/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => {
        console.error("Error fetching request:", err);
        setFormData(null);
      });

    fetch('/distric.json')
      .then((res) => res.json())
      .then((data) => {
        const capitalized = data.map(d => ({ ...d, name: d.name.charAt(0).toUpperCase() + d.name.slice(1) }));
        setDistricts(capitalized);
      })
      .catch((error) => {
        console.error('Error fetching districts:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load districts',
          text: 'Please try again later.',
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUpazilas = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.upazilas : [];
  };

  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to update this request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const { _id, ...updatedData } = formData;
        await axiosSecure.put(`/donationRequestById/${id}`, updatedData);
        Swal.fire('Updated!', 'The request has been updated.', 'success');
      } catch (err) {
        console.error("Update failed", err);
        Swal.fire('Failed!', 'Failed to update request.', 'error');
      }
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axiosSecure.delete(`/donationRequestById/${id}`);
        Swal.fire('Deleted!', 'The request has been deleted.', 'success');
        navigate('/my-requests');
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire('Failed!', 'Failed to delete request.', 'error');
      }
      setLoading(false);
    }
  };

  if (!formData) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">Update Donation Request</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Requester Name</label>
            <input
              type="text"
              value={formData.requesterName}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium">Requester Email</label>
            <input
              type="email"
              value={formData.requesterEmail}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">District</label>
            <select
              name="recipientDistrict"
              value={formData.recipientDistrict}
              onChange={(e) => {
                handleChange(e);
                setFormData(prev => ({ ...prev, recipientUpazila: '' }));
              }}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="" disabled>Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Upazila</label>
            <select
              name="recipientUpazila"
              value={formData.recipientUpazila}
              onChange={handleChange}
              disabled={!formData.recipientDistrict}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="" disabled>Select Upazila</option>
              {getUpazilas(formData.recipientDistrict).map((upazila, index) => (
                <option key={index} value={upazila}>{upazila}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="" disabled>Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Donation Date</label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Donation Time</label>
          <input
            type="time"
            name="donationTime"
            value={formData.donationTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Request Message</label>
          <textarea
            name="requestMessage"
            value={formData.requestMessage}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Request'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestViewDetail;
