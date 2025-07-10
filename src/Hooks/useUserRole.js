// src/hooks/useUserRole.js

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { AuthContext } from '../Contexts/AuthContext/AuthContext';


const fetchUserRole = async (email) => {
  const res = await fetch(`http://localhost:3000/users/role?email=${email}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user role');
  }
  return res.json(); // Expected to return: { role: "admin" } or similar
};

export const useUserRole = () => {
  const { user } = use(AuthContext); // get user from context

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: () => fetchUserRole(user.email),
    enabled: !!user?.email, // only run when email is available
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    role: data?.role || null,
    isLoading,
    isError,
    error,
  };
};

export default useUserRole;
