import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:4000/pay";

interface PaymentVariables {
  id: number;
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
  user: string;
}
interface PaymentVariabless {
  tx_ref: string;
  sender: string;
  receiver: string;
}

const Payment = () => {
  const session = authClient.useSession();
  const queryClient = useQueryClient();
  const { id } = session.data?.user || {};

  const paymentMutation = useMutation({
    mutationFn: async (variables: PaymentVariables) => {
      const { id, amount, email, first_name, last_name, user } = variables;

      const response = await axios.post(
        `${API_BASE_URL}/`,
        { id, amount, email, first_name, last_name, user },
        {
          withCredentials: true,
        }
      );

      return response.data.checkout_url;
    },
    onSuccess: () => {},
  });
  const paymentMutationVerify = useMutation({
    mutationFn: async (variables: PaymentVariabless) => {
      const { tx_ref, sender, receiver } = variables;
      const response = await axios.get(
        `${API_BASE_URL}/verify-payment/${tx_ref}`,
        {
          params: {
            sender,
            receiver,
          },
          withCredentials: true,
        }
      );
      console.log("this is response from vvvvvvvvvvvvvvv", response);
      return response.data.message;
    },
    onSuccess: (data) => {
      // Handle successful verification
      toast.success("Payment verified successfully");
    },
    onError: (error) => {
      // Handle error
      toast.error("Failed to verify payment");
      console.error("Payment verification error:", error);
    },
  });

  return {
    paymentMutation,
    paymentMutationVerify,
  };
};

export default Payment;
