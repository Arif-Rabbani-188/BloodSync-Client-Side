import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for image upload

const Register = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    bloodGroup: '',
    selectedDistrict: '',
    selectedUpazila: '',
    password: '',
    confirmPassword: '',
  });
  const [districts, setDistricts] = useState([]); // State for districts

  const [message, setMessage] = useState(''); // State for custom modal message
  const [showMessageBox, setShowMessageBox] = useState(false); // State to control message box visibility
  
  useEffect(() => {
    fetch('distric.json')
    .then(response => response.json())
    .then(data => {
      setDistricts(data); // Set the districts state with fetched data
    })
    .catch(error => {
      console.error('Error fetching districts:', error);
      showCustomMessageBox("Failed to load districts. Please try again later.");
    });
  }, []);

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Get upazilas based on the selected district
  const getUpazilas = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.upazilas : [];
  };

  // Function to show custom message box
  const showCustomMessageBox = (msg) => {
    setMessage(msg);
    setShowMessageBox(true);
  };

  // Function to hide custom message box
  const hideCustomMessageBox = () => {
    setShowMessageBox(false);
    setMessage('');
  };

  // ImgUpload component integrated directly
  const ImgUpload = () => {
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formDataImg = new FormData(); // Use a different name to avoid conflict
      formDataImg.append("image", file);

      const apiKey = "3f697030e4d83e5c4e100377a41b3b1b";

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          formDataImg
        );
        const url = response.data.data.display_url;
        setFormData(prevData => ({
          ...prevData,
          avatarUrl: url, // Update the avatarUrl state in the parent component's formData
        }));
        console.log("Image uploaded:", url);
      } catch (error) {
        console.error("Upload failed", error);
        showCustomMessageBox("Image upload failed. Please try again.");
      }
    };

    return (
      <div className="p-2 border border-gray-200 rounded-xl">
        <label htmlFor="avatar-upload" className="block text-gray-700 text-sm font-bold mb-2">
          Upload Avatar
        </label>
        <input
          id="avatar-upload"
          type="file"
          onChange={handleImageUpload}
          className="w-full text-gray-700 p-2 btn bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          accept="image/*"
        />
        {formData.avatarUrl && (
          <div className="mt-4 flex justify-center">
            <img src={formData.avatarUrl} alt="Uploaded Avatar" className="w-32 h-32 object-cover rounded-full border-2 border-blue-300 shadow-md" />
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showCustomMessageBox("Passwords do not match!");
      return;
    }
    // Here you would handle form submission, e.g., send data to a backend
    console.log("Form Data:", formData);
    showCustomMessageBox("Registration form submitted! Check console for data.");
    // Add further validation and API calls here
  };

  return (
    <div className="min-h-screen pt-20 md:pt-30 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-xl w-full flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center mb-4">
          Register for <span className="text-blue-700">Account</span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <input
            type="text"
            name="name" // Add name attribute
            placeholder="Full Name"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          {/* Email Field */}
          <input
            type="email"
            name="email" // Add name attribute
            placeholder="Email Address"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          {/* Avatar Upload Component */}
          <ImgUpload />

          {/* Blood Group Selector */}
          <select
            name="bloodGroup" // Add name attribute
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* District Selector */}
          <select
            name="selectedDistrict" // Add name attribute
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
            value={formData.selectedDistrict}
            onChange={(e) => {
              setFormData(prevData => ({
                ...prevData,
                selectedDistrict: e.target.value,
                selectedUpazila: '', // Reset upazila when district changes
              }));
            }}
            required
          >
            <option value="" disabled>Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>

          {/* Upazila Selector */}
          <select
            name="selectedUpazila" // Add name attribute
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
            value={formData.selectedUpazila}
            onChange={handleInputChange}
            disabled={!formData.selectedDistrict} // Disable if no district is selected
            required
          >
            <option value="" disabled>Select Upazila</option>
            {getUpazilas(formData.selectedDistrict).map((upazila, index) => (
              <option key={index} value={upazila}>
                {upazila}
              </option>
            ))}
          </select>

          {/* Password Field */}
          <input
            type="password"
            name="password" // Add name attribute
            placeholder="Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {/* Confirm Password Field */}
          <input
            type="password"
            name="confirmPassword" // Add name attribute
            placeholder="Confirm Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
            <svg
              className="w-6 h-6 ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </button>
        </form>
      </div>

      {/* Custom Message Box */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
            <button
              onClick={hideCustomMessageBox}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
