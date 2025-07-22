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
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

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
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  //singOut
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  // show user listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        return;
      }
      setUserListings(
        userListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-md p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
      <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
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
          className="w-full bg-slate-700 text-white py-2 rounded uppercase hover:bg-blue-700 cursor-pointer"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        <div className="flex justify-center  w-full bg-green-700 text-white py-2 rounded uppercase hover:bg-blue-700">
          <Link className="cursor-pointer" to={"/create-listing"}>
            Create Listing
          </Link>
        </div>
      </form>
      <div className="flex justify-between mt-5 ">
        <div className="flex gap-3">
          <span
            onClick={handleDeleteUser}
            className=" bg-red-700  cursor-pointer outline-none rounded p-2"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className=" bg-yellow-700  cursor-pointer outline-none rounded p-2"
          >
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

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <button
          onClick={handleShowListings}
          className="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition"
        >
          Show Listings
        </button>

        {showListingsError && (
          <p className="text-center text-red-500">Error fetching listings</p>
        )}

        {userListings && userListings.length > 0 && (
          <div className="grid grid-cols-1  gap-6">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="Listing cover"
                    className="h-48 w-full object-cover"
                  />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/listing/${listing._id}`}>
                      <h3 className="text-lg font-semibold hover:text-blue-600 transition">
                        {listing.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">{listing.address}</p>
                    <p className="mt-1 text-sm text-gray-700 font-medium">
                      ${listing.regularPrice}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link to={`/update-listing/${listing._id}`}>
                    <button
                      type="button"
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      type="button"
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
