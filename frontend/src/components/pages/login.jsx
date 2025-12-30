import { Link } from "react-router";

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 sm:px-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-800">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-white mb-2">
          Welcome back
        </h2>

        <p className="text-sm sm:text-base text-center text-gray-400 mb-6">
          Login to your account
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
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
