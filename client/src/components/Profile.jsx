import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase"; // Adjust the import path as necessary
import {
  updateUserStart,
  updateUsersuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
// Import necessary actions from your Redux slice
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      hadleFileUpload(file);
    }
  }, [file]);

  // Function to handle file upload
  // This function uploads the file to Firebase Storage and tracks the upload progress
  const hadleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    // Here you would typically upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress, pause, and resume
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        // Handle unsuccessful uploads
        setfileUploadError(true);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, avatar: downloadURL });
        });
        console.log("File uploaded successfully");
      }
    );
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUsersuccess(data));
      setupdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method : 'DELETE',
      })
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } 
    catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-md p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="flex flex-col items-center mb-6">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-4 cursor-pointer"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-500">
                Error uploading file(image must be less than 2 mb)
              </span>
            ) : filePercent > 0 && filePercent < 100 ? (
              <span className="text-blue-500">Uploading: {filePercent}% </span>
            ) : filePercent === 100 ? (
              <span className="text-green-500"> Upload complete </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            onChange={handleChange}
            type="text"
            id="username"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Enter your username"
            defaultValue={currentUser.username}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            onChange={handleChange}
            type="email"
            id="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Enter your email"
            defaultValue={currentUser.email}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            onChange={handleChange}
            type="password"
            id="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Enter your password"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full  bg-slate-700 text-white py-2 rounded uppercase hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <div className="flex gap-3">
          <span
            onClick={handleDeleteUser}
            className=" bg-red-700  cursor-pointer outline-none rounded p-2"
          >
            Delete Account
          </span>
          <span className=" bg-yellow-700  cursor-pointer outline-none rounded p-2">
            Sign Out
          </span>
        </div>
      </div>
      <p>{error && <span className="text-red-500">{error}</span>}</p>
      <p>
        {updateSuccess && (
          <span className="text-green-500">Profile updated successfully!</span>
        )}
      </p>
    </div>
  );
}
