import axios from "axios";
import { useNavigate } from "react-router";
import auth from "../../Firebase/firebase.init.js";
import { getIdToken } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: 'https://blood-sync-server-side.vercel.app',
  // baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    async (config) => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await getIdToken(currentUser, /* forceRefresh */ false);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            delete config.headers.Authorization;
          }
        } else {
          delete config.headers.Authorization;
        }
      } catch (e) {
        delete config.headers.Authorization;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const status = error.response?.status;
      if (status === 403) {
        navigate("/forbidden");
      }
      if (status === 401) {
        
      }
      return Promise.reject(error);
    }
  );
  return axiosSecure;
};

export default useAxiosSecure;
