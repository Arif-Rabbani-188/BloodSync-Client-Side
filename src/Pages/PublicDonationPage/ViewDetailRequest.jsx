import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const ViewDetailRequest = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const { displayName: name, email } = user || {};

  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get(`/donationRequestById/${id}`)
      .then((res) => setRequest(res.data))
      .catch((err) => {
        console.error("Error fetching request:", err);
        setRequest(null);
      });
  }, [id]);

  const handleDonate = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const updated = {
        status: 'inprogress',
        donorName: name,
        donorEmail: email,
      };

      await axiosSecure.patch(`/donationRequestById/${id}`, updated);

      setRequest((prev) => ({ ...prev, ...updated }));
      setShowModal(false);
    } catch (err) {
      console.error("Donation confirm failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const {
    requesterName,
    requesterEmail,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    address,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    status,
    donorName,
    donorEmail
  } = request;

  return (
    <div className="max-w-3xl mx-auto my-10 md:mt-30 mt-10 bg-white shadow-xl rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-center text-red-600">Donation Request Details</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Requester Name:</strong> {requesterName}</p>
        <p><strong>Requester Email:</strong> {requesterEmail}</p>
        <p><strong>Recipient Name:</strong> {recipientName}</p>
        <p><strong>District:</strong> {recipientDistrict}</p>
        <p><strong>Upazila:</strong> {recipientUpazila}</p>
        <p><strong>Hospital:</strong> {hospitalName}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Blood Group:</strong> {bloodGroup}</p>
        <p><strong>Donation Date:</strong> {donationDate}</p>
        <p><strong>Donation Time:</strong> {donationTime}</p>
        <p><strong>Message:</strong> {requestMessage}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`font-semibold px-2 py-1 rounded ${
              status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'inprogress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {status}
          </span>
        </p>
        {status === 'inprogress' && (
          <>
            <p><strong>Donor Name:</strong> {donorName}</p>
            <p><strong>Donor Email:</strong> {donorEmail}</p>
          </>
        )}
      </div>

      {status === 'pending' && (
        <button
          onClick={handleDonate}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Donate
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Confirm Donation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Donor Name</label>
                <input type="text" value={name} readOnly className="w-full p-2 border rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium">Donor Email</label>
                <input type="email" value={email} readOnly className="w-full p-2 border rounded bg-gray-100" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loading ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetailRequest;
