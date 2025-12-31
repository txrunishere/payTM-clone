import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import axios from "axios";
import config from "../../lib/config";
import { Link } from "react-router";

export const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const { user: authUser } = useAuth();

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const resUsers = await axios.get(`${config.BACKEND_URL}/user/bulk`, {
        params: {
          filter: search,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      setUsers(
        resUsers.data?.users?.filter((user) => user._id !== authUser._id)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (!search) return;

    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="container mx-auto">
      {/* navbar */}
      <nav className="w-full border-b p-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Payments App</h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-lg font-semibold">
            Hello, {authUser?.firstName ? authUser?.firstName : "User"}
          </p>
        </div>
      </nav>

      <div className="mt-4 p-6">
        <div>
          <p className="text-lg font-semibold">
            Your balance: ${authUser?.balance}
          </p>
        </div>

        <div>
          <p className="text-2xl mt-8 font-bold">Users</p>

          <div className="mt-4">
            <input
              type="text"
              placeholder="search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-neutral-500 rounded py-1 px-2 focus:outline-none"
            />
          </div>

          <div className="mt-4">
            {search.trim() &&
              !userLoading &&
              users.map((user) => <User key={user._id} user={user} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

function User({ user }) {
  return (
    <div className="w-full flex items-center justify-between py-2">
      <div className="flex items-center gap-6">
        <p className="rounded-full w-10 flex items-center justify-center bg-gray-600 p-2">
          {user?.firstName?.[0].toUpperCase()}
        </p>
        <h3 className="text-lg font-semibold">{user?.firstName}</h3>
      </div>
      <div>
        <Link
          to={`/send?userId=${user._id}&user=${user.firstName}`}
          className="p-2 cursor-pointer rounded-sm bg-neutral-100 text-black"
        >
          Send Money
        </Link>
      </div>
    </div>
  );
}
