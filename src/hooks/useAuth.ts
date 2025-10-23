import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {userApi} from '../api/userApi';
import {LoginCredentials, RegisterData} from '../types/user';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: userApi.getCurrentUser,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => userApi.login(credentials),
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => userApi.register(data),
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
