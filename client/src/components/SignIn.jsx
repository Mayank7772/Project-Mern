import React from "react";
import { Link , useNavigate} from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { singInStart  , singInFailure , singInSuccess} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = React.useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(singInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(singInFailure(data.message));
        return;
      }
      dispatch(singInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(singInFailure(error.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl text-center font-semibold">Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center mt-10"
      >
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
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="mt-4">
        Dont have an account?{" "}
        <Link to="/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
      { 
      error &&
      <p className="text-red-500 mt-2"> 
        {error }
      </p>
      }
    </div>
  );
}
