import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { NavLink } from 'react-router';

const DonateNow = () => {
    return (
        <div className='flex min-h-[200px] flex-col lg:flex-row items-center justify-between  bg-gradient-to-br md:px-30 p-10 md:p-10 gap-10 bg-rose-600 rounded-tr-[90px] text-white'>
            <div className='flex flex-col gap-3'>
                <h1 className='text-xl md:text-4xl font-bold'>We have been saving lives for 10 years</h1>
                <p className='text-gray-100'>Join our mission to connect donors and recipients through our trusted platform.</p>
            </div>
            <div>
                <NavLink to="/donation-requests" className="md:p-2 pl-5 md:pl-5 rounded-tr-lg font-bold md:text-lg bg-white text-black rounded-full shadow-2xl flex items-center jus gap-5">
            Donate Now{" "}
            <span className="p-2 bg-green-400 text-white rounded-tl-full rounded-bl-full rounded-br-full">
              <FaArrowRight />
            </span>
          </NavLink>
            </div>
        </div>
    );
};

export default DonateNow;