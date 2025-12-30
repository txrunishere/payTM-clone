import { Route, Routes } from "react-router";
import { Dashboard, Login, Register } from "./components/pages";
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
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
