import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Components/Loader/Loader";


const AllDonationRequests = () => {
  const [fundings, setFundings] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {

    const fetchFundings = async () => {
      try {
        const res = await axiosSecure.get(`/fundings`);
        setFundings(res.data || []);
        setLoading(false);
      } catch {
        setFundings([]);
        setLoading(false);
      }
    };
    fetchFundings();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader size="lg" message="Loading fundings..." /></div>;

  return (
    <div className="p-4 mt-20 md:mt-30 w-11/12 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        All Fundings
      </h2>

      {/* Fundings Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Fundings</h3>
          <button
            onClick={() => navigate("/give-fund")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Give Fund
          </button>
        </div>

        {/* Table for desktop */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full rounded shadow" style={{background:"var(--color-surface)", color:"var(--color-text)", border:"1px solid var(--color-border)"}}>
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Donor Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {fundings.map((fund) => (
                <tr key={fund._id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{fund.name}</td>
                  <td className="py-2 px-4 border-b">{fund.email}</td>
                  <td className="py-2 px-4 border-b">${fund.amount}</td>
                  <td className="py-2 px-4 border-b">{new Date(fund.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for mobile */}
        <div className="block md:hidden space-y-4">
          {fundings.map((fund) => (
            <div
              key={fund._id}
              className="bg-white rounded-lg shadow p-4 border"
            >
              <p><span className="font-semibold">Name:</span> {fund.name}</p>
              <p><span className="font-semibold">Email:</span> {fund.email}</p>
              <p><span className="font-semibold">Amount:</span> ${fund.amount}</p>
              <p><span className="font-semibold">Date:</span> {new Date(fund.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllDonationRequests;
