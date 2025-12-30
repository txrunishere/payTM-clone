import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../../context/auth-context";
import config from "../../lib/config";

export const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { checkAuthUser } = useAuth();

  const handleFirstNameChange = (e) =>
    setUser({ ...user, firstName: e.target.value });

  const handleLastNameChange = (e) =>
    setUser({ ...user, lastName: e.target.value });

  const handleEmailChange = (e) => setUser({ ...user, email: e.target.value });

  const handlePasswordChange = (e) =>
    setUser({ ...user, password: e.target.value });

  const handleUserRegister = async (e) => {
    e.preventDefault();

    try {
      if (user.email && user.firstName && user.lastName && user.password) {
        const res = await axios.post(
          `${config.BACKEND_URL}/user/signup`,
          {
            ...user,
            username: user.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data) {
          localStorage.setItem("token", res.data.jwt);
          let isUser = await checkAuthUser();

          if (isUser) {
            navigate("/dashboard");
          }
        }
      }
    } catch (error) {
      console.log(error);
      setUser({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 sm:px-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-800">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-white mb-2">
          Create an account
        </h2>

        <p className="text-sm sm:text-base text-center text-gray-400 mb-6">
          Sign up to get started
        </p>

        <form onSubmit={handleUserRegister} className="space-y-4">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              id="first-name"
              autoComplete="name"
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={user.firstName}
              onChange={handleFirstNameChange}
            />
          </div>

          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              id="last-name"
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={user.lastName}
              onChange={handleLastNameChange}
            />
          </div>

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
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={user.email}
              onChange={handleEmailChange}
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
              id="password"
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={user.password}
              onChange={handlePasswordChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm sm:text-base font-medium transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have a account?{" "}
          <Link to={"/login"} className="text-teal-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
