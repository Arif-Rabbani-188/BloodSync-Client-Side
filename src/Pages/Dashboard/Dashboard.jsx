import React from 'react';
import { Outlet } from 'react-router';
import DonorDashHome from './DonorDashBoard/DonorDashHome/DonorDashHome';
import Aside from './Aside/Aside';

const Dashboard = () => {
    return (
        <div>
        <Aside></Aside>
            <Outlet />
        </div>
    );
};

export default Dashboard;