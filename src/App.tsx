
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DevCourses from "./pages/DevCourses";
import AICourses from "./pages/AICourses";
import CompanyInfo from "./pages/CompanyInfo";
import CourseDetail from "./pages/CourseDetail";
import Checkout from "./pages/Checkout";
import TopCourses from "./pages/TopCourses";
import CourseUpload from "./pages/CourseUpload";
import InstructorApply from "./pages/InstructorApply";
import Admin from "./pages/Admin";
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
            <Route path="/dev-courses" element={<DevCourses />} />
            <Route path="/ai-courses" element={<AICourses />} />
            <Route path="/company-info" element={<CompanyInfo />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/checkout/:courseId" element={<Checkout />} />
            <Route path="/top-courses" element={<TopCourses />} />
            <Route path="/course-upload" element={<CourseUpload />} />
            <Route path="/instructor-apply" element={<InstructorApply />} />
            <Route path="/admin/*" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
