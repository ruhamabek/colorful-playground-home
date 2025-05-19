import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import payments from "@/api/connectionApi";
import payment from "@/api/paymentApi";
import Header from "@/components/Header";

interface PaymentVariables {
  tx_ref: string;
  sender: string;
  receiver: string;
}

export default function ConnectionsPage() {
  const [requests, setRequests] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [acceptedBy, setAcceptedBy] = useState([]);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const isParent = role === "parent";
  const [searchParams] = useSearchParams();
console.log("requests requests requests:", requests);
console.log("requests accepted accepted:", accepted);
console.log("requests accepted acceptedBy:", acceptedBy);
  const {
    getALLconnectMutation,
    responseMutation,
    getALLacceptedconnectMutation,
    getALLacceptedbyconnectMutation,
  } = payments();
  const { paymentMutation, paymentMutationVerify } = payment();

  // Check for payment verification on initial load
  useEffect(() => {
    const tx_ref = searchParams.get("amp;tx_ref");
    const receiver = searchParams.get("receiver");

    console.log("amp;tx_ref:", tx_ref);
    console.log("receiver:", receiver);
    const verifyPaymentFromUrl = async () => {
      console.log("Verifying payment from URL");

      if (tx_ref && receiver && userId) {
        setIsVerifyingPayment(true);
        try {
          await paymentMutationVerify.mutateAsync({
            tx_ref,
            sender: userId,
            receiver,
          });
          toast.success("Payment verified successfully");
          // Refresh connections after verification
          fetchAllConnections();
        } catch (error) {
          toast.error("Payment verification failed");
          console.error("Payment verification error:", error);
        } finally {
          setIsVerifyingPayment(false);
          // Remove the query params after verification attempt
          window.history.replaceState({}, document.title, "/connections");
        }
      }
    };

    verifyPaymentFromUrl();
  }, [searchParams, userId]);

  const fetchAllConnections = async () => {
    try {
      const [pendingRes, acceptedRes, acceptedByRes] = await Promise.all([
        getALLconnectMutation.mutateAsync(),
        getALLacceptedconnectMutation.mutateAsync(),
        getALLacceptedbyconnectMutation.mutateAsync(),
      ]);
      setRequests(pendingRes);
      setAccepted(acceptedRes);
      setAcceptedBy(acceptedByRes);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load connections");
    }
  };

  const handleSubmit = async (e: React.FormEvent, user) => {
    e.preventDefault();
    const datas = {
      id: 10,
      amount: 100,
      email: "teshx@gmail.com",
      first_name: "teshx",
      last_name: "habtie",
      user: user,
    };

    try {
      const response = await paymentMutation.mutateAsync(datas);
      if (typeof response === "string") {
        window.location.href = response;
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      toast.error("Payment failed");
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllConnections();
    }
  }, [userId]);

  const handleRespond = async (senderId: string, action: string) => {
    try {
      await responseMutation.mutateAsync({ senderId, action });
      toast.success(`Request ${action}ed successfully`);
      fetchAllConnections();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
      console.error("Response error:", error);
    }
  };

  const ConnectionCard = ({ connection, type, display, image }) => {
    const user =
      type === "request"
        ? connection.sender
        : type === "accepted"
        ? connection.sender
        : connection.receiver;

    const paymentStatus = connection.payments || false;

    return (
      <div
        key={connection._id}
        className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {user.title || "HI"}
              </p>
              {!paymentStatus && (
                <p className="text-xs text-yellow-600">
                  {isParent && type === "acceptedBy"
                    ? "Waiting for payment"
                    : "Pending payment"}
                </p>
              )}
            </div>
          </div>

          {type === "request" ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleRespond(connection.sender, "accept")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to reject this request?"
                    )
                  ) {
                    handleRespond(connection.sender, "reject");
                  }
                }}
              >
                Reject
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              {paymentStatus ? (
                <>
                  <Button asChild size="icon" className="rounded-full">
                    <Link to={`/chat/${user}`}>💬</Link>
                  </Button>
                  <Button asChild size="icon" className="rounded-full">
                    <Link to={`/profile/${user}`}>profile</Link>
                  </Button>
                </>
              ) : isParent && type === "acceptedBy" ? (
                <Button
                  size="sm"
                  onClick={(e) => handleSubmit(e as React.FormEvent, user)}
                  type="button"
                >
                  Finish Payment
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled
                >
                  Pending Payment
                </Button>
              )}

              {paymentStatus && (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove this connection?"
                      )
                    ) {
                      handleRespond(
                        display ? connection.receiver : connection.sender,
                        "complete"
                      );
                    }
                  }}
                >
                  X
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isVerifyingPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <div className="text-center p-8 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
          <p className="text-muted-foreground">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-5 mt-10">Connections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!isParent && (
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Parent Requests for service
            </h2>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No pending requests
              </p>
            ) : (
              requests.map((request) => (
                <ConnectionCard
                  key={request._id}
                  connection={request}
                  image={request.images}
                  display={false}
                  type="request"
                />
              ))
            )}
          </div>
        )}

        {!isParent && (
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Your clients</h2>
            {accepted.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No connections yet
              </p>
            ) : (
              accepted.map((conn) => (
                <ConnectionCard
                  key={conn._id}
                  connection={conn}
                  image={conn.images}
                  display={false}
                  type="accepted"
                />
              ))
            )}
          </div>
        )}

        {isParent && (
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Your service provider
            </h2>
            {acceptedBy.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No connections yet
              </p>
            ) : (
              acceptedBy.map((conn) => (
                <ConnectionCard
                  key={conn._id}
                  connection={conn}
                  image={conn.images}
                  display={true}
                  type="acceptedBy"
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
