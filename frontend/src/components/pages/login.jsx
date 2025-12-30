import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/auth-context";
import axios from "axios";
import config from "../../lib/config";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { checkAuthUser } = useAuth();

  const handleEmailChange = (e) => setUser({ ...user, email: e.target.value });
  const handlePasswordChange = (e) =>
    setUser({ ...user, password: e.target.value });

  const handleUserLogin = async (e) => {
    e.preventDefault();

    try {
      if (user.password && user.email) {
        const res = await axios.post(
          `${config.BACKEND_URL}/user/signin`,
          {
            username: user.email,
            password: user.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res?.data) {
          localStorage.setItem("token", res.data?.jwt);
          const isUser = await checkAuthUser();

          if (isUser) {
            navigate("/dashboard");
          }
        }
      }
    } catch (error) {
      console.log(error);
      setUser({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 sm:px-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-800">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-white mb-2">
          Welcome back
        </h2>

        <p className="text-sm sm:text-base text-center text-gray-400 mb-6">
          Login to your account
        </p>

        <form onSubmit={handleUserLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              id="email"
              autoComplete="email"
              value={user.email}
              onChange={handleEmailChange}
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={user.password}
              onChange={handlePasswordChange}
              id="password"
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm sm:text-base font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
