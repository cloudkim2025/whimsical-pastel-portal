
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile"; // Updated path
import NotFound from "./pages/NotFound";
import DevLectures from "./pages/DevLectures"; // Updated name
import AICourses from "./pages/AICourses"; // Updated path
import CompanyInfo from "./pages/CompanyInfo";
import CourseDetail from "./pages/CourseDetail"; // Updated path
import Checkout from "./pages/payment/Checkout"; // Updated to use our new Checkout component
import TopLectures from "./pages/TopLectures"; // Updated name
import LectureUpload from "./pages/LectureUpload"; // Updated name
import InstructorApply from "./pages/instructor/InstructorApply";
import Admin from "./pages/Admin"; // Updated path
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
            <Route path="/ai-courses" element={<AICourses />} />
            <Route path="/company-info" element={<CompanyInfo />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/checkout/:courseId" element={<Checkout />} />
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
