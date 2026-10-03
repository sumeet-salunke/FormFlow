import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/auth/Dashboard.jsx";
import CreateForm from "./pages/forms/CreateForm.jsx";
import MyForms from "./pages/forms/MyForms.jsx";
import EditForm from "./pages/forms/EditForm.jsx";
import ViewForm from "./pages/forms/ViewForm.jsx";
import PublicForm from "./pages/forms/PublicForm.jsx";

import FormBuilder from "./pages/forms/FormBuilder.jsx";
import ResponseSubmitted from "./pages/forms/ResponseSubmitted.jsx";
import FormResponses from "./pages/forms/FormResponses.jsx";
import EditResponse from "./pages/forms/EditResponse.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthenticatedLayout from "./components/AuthenticatedLayout.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forms/public/:publicId" element={<PublicForm />} />
        <Route path="/forms/public/:publicId/submitted" element={<ResponseSubmitted />} />

        {/* Protected Owner Routes wrapped in AuthenticatedLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forms" element={<MyForms />} />
          <Route path="/forms/create" element={<CreateForm />} />
          <Route path="/forms/:formId" element={<ViewForm />} />
          <Route path="/forms/:formId/edit" element={<EditForm />} />
          <Route path="/forms/:formId/builder" element={<FormBuilder />} />
          <Route path="/responses/form/:formId" element={<FormResponses />} />
          <Route path="/responses/:responseId/edit" element={<EditResponse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;