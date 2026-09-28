import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/auth/Dashboard.jsx";
import CreateForm from "./pages/forms/CreateForm.jsx";
import MyForms from "./pages/forms/MyForms.jsx";

const App = () => {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/create" element={<CreateForm />} />
        <Route path="/forms" element={<MyForms />} />

      </Routes>
    </BrowserRouter>
  </>
};

export default App;