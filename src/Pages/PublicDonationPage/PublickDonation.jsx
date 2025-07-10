import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';

// Dummy data for demonstration
const donationRequests = [
    {
        id: 1,
        recipientName: 'John Doe',
        location: 'Dhaka',
        bloodGroup: 'A+',
        date: '2024-06-10',
        time: '10:00 AM',
    },
    {
        id: 2,
        recipientName: 'Jane Smith',
        location: 'Chittagong',
        bloodGroup: 'B-',
        date: '2024-06-12',
        time: '2:00 PM',
    },
];

const PublickDonation = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/donationRequest')
            .then((response) => {
                const pendingRequests = (response.data || []).filter(req => req.status === 'pending');
                setRequests(pendingRequests);
            })
            .catch(() => {
                setRequests([]);
            });
    }, []);

    const{user, loading} = use(AuthContext)

    const handleView = (id) => {
        if (!user || loading ) {
            navigate('/login');
        } else {
            navigate(`/donation-requests/${id}`);
        }
    };

    if (!requests) {
        return <p className="text-center mt-4 text-gray-500">Loading requests...</p>;
    }


    return (
        <div className='mt-22 md:mt-30 '>
            <h2 className="text-center mt-6 text-2xl font-bold text-red-700">
                Blood Donation Requests
            </h2>
            {
                requests.length === 0 && (
                    <p className="text-center mt-4 text-gray-500">
                        No donation requests available at the moment.
                    </p>
                )
            }
            <div className="flex flex-wrap gap-6 justify-center mt-8">
                {requests.map((req) => (
                    <div
                        key={req.id}
                        className="bg-white max-w-xs w-full rounded-xl shadow-md border border-gray-200 p-6 flex flex-col"
                    >
                        <div className="mb-2">
                            <span className="font-semibold text-gray-600 mr-2">Recipient:</span>
                            {req.recipientName}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-600 mr-2">Location:</span>
                            {req.recipientDistrict}, {req.recipientUpazila}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-600 mr-2">Blood Group:</span>
                            <span className="text-red-700 font-bold">{req.bloodGroup}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-600 mr-2">Date:</span>
                            {req.donationDate}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-600 mr-2">Time:</span>
                            {req.donationTime}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold text-gray-600 mr-2">Hospital:</span>
                            {req.hospitalName || 'N/A'}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold text-gray-600 mr-2">Posted By:</span>
                            {req.requesterName || 'Anonymous'   }
                        </div>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded mt-auto transition"
                            onClick={() => handleView(req._id)}
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublickDonation;
