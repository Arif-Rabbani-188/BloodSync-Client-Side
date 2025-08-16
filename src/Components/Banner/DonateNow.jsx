import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { NavLink } from 'react-router';

const DonateNow = () => {
    return (
    <div className='flex min-h-[200px] flex-col lg:flex-row items-center justify-between md:px-30 p-10 md:p-10 gap-10 rounded-tr-[90px] text-white' style={{background:"linear-gradient(135deg, rgba(220,38,38,.9), rgba(190,18,60,.9))"}}>
            <div className='flex flex-col gap-3'>
                <h1 className='text-xl md:text-4xl font-bold'>We have been saving lives for 10 years</h1>
                <p className='text-white/85'>Join our mission to connect donors and recipients through our trusted platform.</p>
            </div>
            <div>
                                <NavLink to="/donation-requests" className="btn btn-primary bg-white text-red-700" style={{background:"#fff"}}>
                                    Donate Now
                                    <span className="p-2 bg-green-500 text-white rounded-full">
                                        <FaArrowRight />
                                    </span>
                                </NavLink>
            </div>
        </div>
    );
};

export default DonateNow;