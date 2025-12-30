import { Route, Routes } from "react-router";
import { Dashboard, Login, Register, Send } from "./components/pages";
import { AuthContextProvider } from "./context/auth-context";
import { AuthLayout } from "./components/layout/auth-layout";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<Send />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
