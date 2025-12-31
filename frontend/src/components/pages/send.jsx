import { useNavigate, useParams, useSearchParams } from "react-router";
import { useState } from "react";
import axios from "axios";
import config from "../../lib/config";

export const Send = () => {
  const [search, _] = useSearchParams();
  const [amount, setAmount] = useState(0);
  const userId = search.get("userId") ?? "";
  const username = search.get("user") ?? "";
  const navigate = useNavigate();

  const handleTransaction = async () => {
    try {
      if (amount > 0 && userId) {
        const res = await axios.post(
          `${config.BACKEND_URL}/account/transfer`,
          {
            to: userId,
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (res) {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Send Money
        </h2>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-lg">
            {username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{username}</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Amount (in Rs)
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="
              w-full rounded-md bg-gray-700 border border-gray-600
              px-3 py-2 text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            "
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          className="
            w-full bg-green-500 hover:bg-green-600
            text-white font-semibold py-2.5 rounded-md
            transition duration-200
          "
          onClick={handleTransaction}
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
};
