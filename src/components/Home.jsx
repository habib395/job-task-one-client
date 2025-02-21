import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import TaskBoard from "./TaskBoard";

const Home = () => {
  const { user, handleLogOut } = useContext(AuthContext);

  return user ? (
    <div className="max-w-screen-xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome, {user.displayName}</h2>
        <button
          onClick={handleLogOut}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* TaskBoard Section */}
      <TaskBoard />

    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <p className="text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Home;
