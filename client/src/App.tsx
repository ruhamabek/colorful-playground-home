import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/Signins";
import SignUp from "./pages/signUps";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/profile";
import BrowseProfiles from "./pages/BrowseProfiles";
import SingleProfilePage from "./pages/SingleProfilePage";
import ConnectionsPage from "./pages/ConnectionsPage";
import Messanger from "./pages/Messanger";
import Admindashbored from "./pages/Admindashbored";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userid" element={<SingleProfilePage />} />
          <Route path="/browse" element={<BrowseProfiles />} />
          <Route path="/dashboard" element={<Admindashbored />} />
          <Route path="/chat/:id" element={<Messanger />} />
          {/* Redirect /forgot-password to sign-in for now */}
          <Route path="/forgot-password" element={<Navigate to="/sign-in" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
