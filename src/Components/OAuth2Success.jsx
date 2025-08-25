import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OAuth2SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const username = urlParams.get("username");

    if (token) {
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      toast.success("Login successful");
      navigate("/");
      window.location.reload(); // Refresh for new state
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="text-center p-6 rounded-lg shadow-md bg-white/80 backdrop-blur-sm border border-gray-200">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium text-gray-700">Processing login...</p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we securely log you in.
        </p>
      </div>
    </div>
  );
};
export default OAuth2SuccessPage;