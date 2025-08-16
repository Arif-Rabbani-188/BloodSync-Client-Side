import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../../Hooks/useUserRole';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
  <p className="text-2xl mt-4">Access Forbidden</p>
      <p className="text-gray-600 mt-2">
        {role
          ? `You are logged in as "${role}" and do not have permission to view this page.`
          : 'You are not authorized to access this page.'}
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ForbiddenPage;
