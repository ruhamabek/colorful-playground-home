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
  const getALLProfileMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/all/allprofile`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {},
  });
  const getsingleProfileMutation = useMutation({
    mutationFn: async (userid: string) => {
      const response = await axios.get(`${API_BASE_URL}/${userid}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {},
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

  const updateProfileStatus = useMutation({
    mutationFn: async ({
      status,
      userid,
    }: {
      status: string;
      userid: string;
    }) => {
      if (!session.data?.user?.id) throw new Error("User not authenticated");

      console.log("Updating status for user from API:", userid, "to", status);
      const response = await axios.put(
        `${API_BASE_URL}/status/${userid}`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {},
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
    getALLProfileMutation,
    getsingleProfileMutation,
    updateProfileStatus,
  };
};

export default useProfile;
