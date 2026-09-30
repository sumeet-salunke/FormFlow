import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/auth/Dashboard.jsx";
import CreateForm from "./pages/forms/CreateForm.jsx";
import MyForms from "./pages/forms/MyForms.jsx";
import EditForm from "./pages/forms/EditForm.jsx";
import ViewForm from "./pages/forms/viewForm.jsx";
import PublicForm from "./pages/forms/PublicForm.jsx";

import FormBuilder from "./pages/forms/FormBuilder.jsx";


const App = () => {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/forms/public/:publicId" element={<PublicForm />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/create" element={<CreateForm />} />
        <Route path="/forms" element={<MyForms />} />
        <Route path="/forms/:formId/edit" element={<EditForm />} />
        <Route path="/forms/:formId" element={<ViewForm />} />

        <Route path="/forms/:formId/builder" element={<FormBuilder />} />

      </Routes>
    </BrowserRouter>
  </>
};

export default App;