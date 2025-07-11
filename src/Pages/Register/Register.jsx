import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';

const Register = () => {
    const {user, createUserWithEmail} = use(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photoURL: '',
        bloodGroup: '',
        selectedDistrict: '',
        selectedUpazila: '',
        password: '',
        confirmPassword: '',
    });
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        fetch('distric.json')
            .then(response => response.json())
            .then(data => {
                setDistricts(data);
            })
            .catch(error => {
                console.error('Error fetching districts:', error);
                import('sweetalert2').then(Swal => {
                    Swal.default.fire({
                        icon: 'error',
                        title: 'Failed to load districts',
                        text: 'Please try again later.',
                    });
                });
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const getUpazilas = (districtId) => {
        const district = districts.find(d => d.id === districtId);
        return district ? district.upazilas : [];
    };

    // ImgUpload component integrated directly
    const ImgUpload = () => {
        const handleImageUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formDataImg = new FormData();
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
                    photoURL: url,
                }));
            } catch (error) {
                console.error("Upload failed", error);
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
                {formData.photoURL && (
                    <div className="mt-4 flex justify-center">
                        <img src={formData.photoURL} alt="Uploaded Avatar" className="w-32 h-32 object-cover rounded-full border-2 border-blue-300 shadow-md" />
                    </div>
                )}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            import('sweetalert2').then(Swal => {
                Swal.default.fire({
                    icon: 'error',
                    title: 'Passwords do not match!',
                });
            });
            return;
        }

        try {
            // Capitalize the first letter of the district name
            const selectedDistrictObj = districts.find(d => d.id === formData.selectedDistrict);
            const districtName = selectedDistrictObj
                ? selectedDistrictObj.name.charAt(0).toUpperCase() + selectedDistrictObj.name.slice(1)
                : formData.selectedDistrict;

            const userData = {
                name: formData.name,
                email: formData.email,
                photoURL: formData.photoURL,
                bloodGroup: formData.bloodGroup,
                district: districtName,
                upazila: formData.selectedUpazila,
                status: 'active',
                role: 'donor',
                createdAt: new Date().toISOString(),
            };

            const checkRes = await axios.get("https://blood-sync-server-side.vercel.app/users");
            const userExists = checkRes.data.some(user => user.email === formData.email);
            if (userExists) {
                import('sweetalert2').then(Swal => {
                    Swal.default.fire({
                        icon: 'warning',
                        title: 'User already exists!',
                        text: 'An account with this email already exists.',
                    });
                });
                return;
            }

            createUserWithEmail(formData.email, formData.password, formData.photoURL, formData.name)
                .then((result) => {
                    const updatedUser = {
                        ...userData,
                        email: formData.email.toLowerCase(),
                    };
                    const response = axios.post("https://blood-sync-server-side.vercel.app/users", updatedUser);
            console.log("Registration successful:", response.data);
            import('sweetalert2').then(Swal => {
                Swal.default.fire({
                    icon: 'success',
                    title: 'Registration successful!',
                    text: 'Welcome to BloodSync, you can now start donating blood.',
                });
            });
            setFormData({
                name: '',
                email: '',
                photoURL: '',
                bloodGroup: '',
                selectedDistrict: '',
                selectedUpazila: '',
                password: '',
                confirmPassword: ''
            });
                    
                })
                .catch((error) => {
                    console.error("Error creating user:", error);
                    import('sweetalert2').then(Swal => {
                        Swal.default.fire({
                            icon: 'error',
                            title: 'Registration failed',
                            text: error.message,
                        });
                    });
                    return;
                });
            // Check if user already exists by email
            

            

            // Proceed with registration
            
        } catch (error) {
            import('sweetalert2').then(Swal => {
                Swal.default.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text: 'Registration failed. Please try again.',
                });
            });
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen pt-20 md:pt-30 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center font-sans">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-xl w-full flex flex-col gap-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center mb-4">
                    Register for <span className="text-blue-700">Account</span>
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <ImgUpload />

                    <select
                        name="bloodGroup"
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

                    <select
                        name="selectedDistrict"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
                        value={formData.selectedDistrict}
                        onChange={(e) => {
                            setFormData(prevData => ({
                                ...prevData,
                                selectedDistrict: e.target.value,
                                selectedUpazila: '',
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

                    <select
                        name="selectedUpazila"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
                        value={formData.selectedUpazila}
                        onChange={handleInputChange}
                        disabled={!formData.selectedDistrict}
                        required
                    >
                        <option value="" disabled>Select Upazila</option>
                        {getUpazilas(formData.selectedDistrict).map((upazila, index) => (
                            <option key={index} value={upazila}>
                                {upazila}
                            </option>
                        ))}
                    </select>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
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
        </div>
    );
};

export default Register;
