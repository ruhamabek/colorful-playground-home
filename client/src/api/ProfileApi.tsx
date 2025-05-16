import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/profile";

const useProfile = () => {
  const session = authClient.useSession();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", session.data?.user?.id],
    queryFn: async () => {
      if (!session.data?.user?.id) return null;
      const response = await axios.get(
        `${API_BASE_URL}/${session.data.user.id}`
      );
      return response.data;
    },
    enabled: !!session.data?.user?.id,
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: object) => {
      const response = await axios.post(API_BASE_URL, profileData, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: object) => {
      if (!session.data?.user?.id) throw new Error("User not authenticated");
      const response = await axios.put(
        `${API_BASE_URL}/${session.data.user.id}`,
        profileData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", session.data?.user?.id],
      });
    },
  });

  const {
    data: allProfiles,
    isLoading: isLoadingAllProfiles,
    isError: isErrorAllProfiles,
    refetch: refetchAllProfiles,
  } = useQuery({
    queryKey: ["allProfiles"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/all`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: false, // Don't fetch automatically, need to call refetch
  });

  return {
    profile,
    isLoading,
    isError,
    createProfileMutation,
    updateProfileMutation,
    allProfiles,
    isLoadingAllProfiles,
    isErrorAllProfiles,
    refetchAllProfiles,
  };
};

export default useProfile;
