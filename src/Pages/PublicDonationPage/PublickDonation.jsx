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
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        setDataLoading(true);
        axios.get('https://blood-sync-server-side.vercel.app/donationRequest')
            .then((response) => {
                const pendingRequests = (response.data || []).filter(req => req.status === 'pending');
                setRequests(pendingRequests);
                setDataLoading(false);
            })
            .catch(() => {
                setRequests([]);
                setDataLoading(false);
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

    

    if (dataLoading) {
        return (
            <div className="flex mt-30 flex-col justify-center items-center h-64">
            <svg className="animate-spin h-10 w-10 text-red-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-gray-600 text-lg">Data is loading, please wait...</span>
            </div>
        );
    }

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
