import React from "react";
import { Link , useNavigate} from "react-router-dom";
import OAuth from "./OAuth";

export default function SignUp() {
  const [formData, setFormData] = React.useState({});
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success == false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center mt-10"
      >
        <input
          type="text"
          placeholder="Username"
          className="border-2 border-gray-300 p-2 rounded-md mb-4 w-80"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border-2 border-gray-300 p-2 rounded-md mb-4 w-80"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-gray-300 p-2 rounded-md mb-4 w-80"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 rounded-md w-80 hover:bg-blue-600 transition duration-200 disabled:opacity-80"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
}
