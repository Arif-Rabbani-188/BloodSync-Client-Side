import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';

const PrivateRoute = ({children}) => {

    const location = useLocation();

    const {user, loading} = use(AuthContext);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" state={location.pathname} replace={true} />
    }
    return (
        children
    );
};

export default PrivateRoute;