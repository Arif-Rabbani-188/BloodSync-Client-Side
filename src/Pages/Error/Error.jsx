import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <div className="text-center max-w-4xl space-y-6">
        <img
          src="https://i.ibb.co/C34XW3pV/3828537.jpg"
          alt="Blood drop error"
          className="w-80 mx-auto animate-bounce"
        />
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="text-gray-600">
          Oops! Looks like the page you're searching for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
