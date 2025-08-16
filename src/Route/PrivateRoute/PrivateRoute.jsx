import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';
import Loader from "../../Components/Loader/Loader";

const PrivateRoute = ({children}) => {

    const location = useLocation();

    const {user, loading} = use(AuthContext);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;

    if (!user) {
        return <Navigate to="/login" state={location.pathname} replace={true} />
    }
    return (
        children
    );
};

export default PrivateRoute;