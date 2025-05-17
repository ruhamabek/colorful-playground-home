import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/connections";

interface restVariables {
  action: string;
}
interface reqVariables {
  action: string;
}

const Payments = () => {
  const session = authClient.useSession();
  const queryClient = useQueryClient();
  const { id } = session.data?.user || {};

  
  const getALLconnectMutation = useMutation({
    mutationFn: async () => {
      if (!session.data?.user?.id) return null;
      
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        withCredentials: true,
      });
      
      return response.data;
    },
    onSuccess: () => {},
  });
  const getALLacceptedconnectMutation = useMutation({
    mutationFn: async () => {
      if (!session.data?.user?.id) return null;
      console.log("this is my id", id);
      const response = await axios.get(`${API_BASE_URL}/accept/${id}`, {
        withCredentials: true,
      });
      console.log("this is response", response);
      return response.data;
    },
    onSuccess: () => {},
  });
  const getALLacceptedbyconnectMutation = useMutation({
    mutationFn: async () => {
      if (!session.data?.user?.id) return null;
      console.log("this is my id", id);
      const response = await axios.get(`${API_BASE_URL}/acceptby/${id}`, {
        withCredentials: true,
      });
      console.log("this is response", response);
      return response.data;
    },
    onSuccess: () => {},
  });

  const responseMutation = useMutation({
    mutationFn: async ({
      senderId,
      action,
    }: {
      senderId: string;
      action: string;
    }) => {
      if (!session.data?.user?.id) return null;
      const response = await axios.put(
        `${API_BASE_URL}/res/${id}`,
        { senderId, action },
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {},
  });
  const CountrequestMutation = useMutation({
    mutationFn: async () => {
      if (!session.data?.user?.id) return null;

      const response = await axios.get(`${API_BASE_URL}/count/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {},
  });
  const AskMutation = useMutation({
    mutationFn: async ({
      action,
      image,
    }: {
      action: string;
      image: string;
    }) => {
      if (!session.data?.user?.id) return null;

      const response = await axios.post(
        `${API_BASE_URL}/ask/${id}`,
        { action, image },
        {
          withCredentials: true,
        }
      );
      return response.data?.message;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(["connections"]);
    },
  });

  return {
    getALLconnectMutation,
    responseMutation,
    CountrequestMutation,
    AskMutation,
    getALLacceptedconnectMutation,
    getALLacceptedbyconnectMutation,
  };
};

export default Payments;
