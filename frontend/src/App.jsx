import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/auth/Dashboard.jsx";
import CreateForm from "./pages/forms/CreateForm.jsx";

const App = () => {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/create" element={<CreateForm />} />

      </Routes>
    </BrowserRouter>
  </>
};

export default App;