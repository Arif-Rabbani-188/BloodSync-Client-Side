import React from 'react';

const Logo = () => {
    return (
        <div className="flex items-center font-bold text-2xl text-red-700">
            <svg
                width="32"
                height="40"
                viewBox="0 0 32 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
            >
                <path
                    d="M16 2C16 2 4 18 4 26C4 33.1797 10.268 38 16 38C21.732 38 28 33.1797 28 26C28 18 16 2 16 2Z"
                    fill="#d32f2f"
                    stroke="#b71c1c"
                    strokeWidth="2"
                />
                <ellipse cx="16" cy="28" rx="6" ry="4" fill="#fff" opacity="0.3" />
            </svg>
            BloodSync
        </div>
    );
};

export default Logo;