import { Routes, Route } from "react-router-dom";
import AdminSessionRoute from "../protecter/adminProtecter/AdminSessionRoute";
import LoginPage from "../pages/admin/Auth/Login";
import AdminPrivateRoute from "../protecter/adminProtecter/AdminPrivateRoute";
import AdminLayout from "../layout/adminLayout/AdminLayout";
import JobRolesList from "../pages/admin/JobRole/JobRolesList";
import CreateJobRole from "../pages/admin/JobRole/CreateJobRole";
import EditJobRole from "../pages/admin/JobRole/EditJobRole";

const AdminRouter = () => {
  return (
    <Routes>
      {/* Public Admin Routes */}
      <Route
        path="login"
        element={
          <AdminSessionRoute>
            <LoginPage />
          </AdminSessionRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route element={<AdminPrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="job-roles" element={<JobRolesList />} />
          <Route path="job-roles/create" element={<CreateJobRole />} />
          <Route path="job-roles/edit/:jobId" element={<EditJobRole />} />
          
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRouter;