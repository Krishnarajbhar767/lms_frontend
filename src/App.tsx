import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Contact from "./pages/contact/contact";
import About from "./pages/about/about";
import ForgotPasswordRequest from "./pages/forgot-password/forgot-password-request";
import ForgotPasswordReset from "./pages/forgot-password/forgot-password-reset";
import VerifyEmail from "./pages/verify-email/verify-email";

import { AdminLayout } from "./layout/admin-layout";
import { AdminCoursesManagement } from "./pages/admin-dashboard/add-course/add-course";
import { PublicLayout } from "./layout/public-layout";
import NotFound from "./components/core/not-found";
import AdminCourses from "./pages/admin-dashboard/courses/admin-courses";
import GlobalLoader from "./components/core/global-loader";
import CategoryPage from "./pages/admin-dashboard/category/category-page";

function App() {

  return (
    <div className="w-screen min-h-screen bg-richblue-900 flex flex-col font-inter">
      <GlobalLoader />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password-request" element={<ForgotPasswordRequest />} />
          <Route path="reset-password" element={<ForgotPasswordReset />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="add-course" element={<AdminCoursesManagement />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="categories" element={<CategoryPage />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
