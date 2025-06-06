
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile"; 
import NotFound from "./pages/NotFound";
import DevLectures from "./pages/lectures/DevLectures"; 
import AILectures from "./pages/lectures/AILectures"; 
import CompanyInfo from "./pages/CompanyInfo";
import LectureDetail from "./pages/lectures/LectureDetail"; 
import Checkout from "./pages/payment/Checkout"; 
import TopLectures from "./pages/lectures/TopLectures";
import LectureUpload from "./pages/lectures/LectureUpload";
import InstructorApply from "./pages/instructor/InstructorApply";
import Admin from "./pages/admin/Admin";
import PaymentHistory from "./pages/payment/PaymentHistory";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dev-lectures" element={<DevLectures />} />
            <Route path="/ai-lectures" element={<AILectures />} />
            <Route path="/company-info" element={<CompanyInfo />} />
            <Route path="/lecture/:lectureId" element={<LectureDetail />} />
            <Route path="/checkout/:lectureId" element={<Checkout />} />
            <Route path="/top-lectures" element={<TopLectures />} />
            <Route path="/lecture-upload" element={<LectureUpload />} />
            <Route path="/instructor-apply" element={<InstructorApply />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
