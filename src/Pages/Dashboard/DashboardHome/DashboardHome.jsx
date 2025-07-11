import React from 'react';
import useUserRole from '../../../Hooks/useUserRole';
import AdminDashboardHome from '../AdminDashboard/AdminDashboardHome';
import DonorDashHome from '../DonorDashBoard/DonorDashHome/DonorDashHome';

const DashboardHome = () => {
    const {role} = useUserRole();
    return (
        <div>
            {
                role === "admin" && (<AdminDashboardHome></AdminDashboardHome>)
            }
            {
                role === "volunteer" && (<AdminDashboardHome></AdminDashboardHome>)
            }
            {
                role === "donor" && (<DonorDashHome></DonorDashHome>)
            }
        </div>
    );
};

export default DashboardHome;