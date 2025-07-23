import React, { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setfiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 1,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "Rent",
    offer: false,
  });

  const handleImageSubmit = (e) => {
    if (files.length === 0) {
      setImageUploadError("please select images to upload");
      return;
    }
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, idx) => idx !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "type") {
      setFormData({
        ...formData,
        type: e.target.value,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.imageUrls.length <= 0) {
        console.log("No images uploaded");
        setError("Please upload at least one image");
        return;
      }
      if (+formData.regularPrice < formData.discountPrice) {
        setError("discount price should be less than regular price");
        return;
      }
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data.listing._id}`);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  return (
    <main className="mx-auto max-w-4xl p-8 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter listing name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            onChange={handleChange}
            value={formData.description}
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-lg font-medium mb-2">
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter address"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="regularPrice"
              className="block text-lg font-medium mb-2"
            >
              Regular Price ($)
            </label>
            <input
              id="regularPrice"
              type="number"
              placeholder="e.g. 1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.regularPrice}
            />
          </div>
          {formData.offer && (
            <div>
              <label
                htmlFor="discountPrice"
                className="block text-lg font-medium mb-2"
              >
                Discount Price ($)
              </label>
              <input
                id="discountPrice"
                type="number"
                placeholder="e.g. 900"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.discountPrice}
                min='0'
              />
            </div>
          )}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-lg font-medium mb-2"
            >
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              placeholder="e.g. 3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.bedrooms}
            />
          </div>
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-lg font-medium mb-2"
            >
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              placeholder="e.g. 2"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              value={formData.bathrooms}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex space-x-10">
          <div className="flex items-center">
            <input
              id="parking"
              type="checkbox"
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.parking}
              onChange={handleChange}
            />
            <label htmlFor="parking" className="ml-2 text-lg font-medium">
              Parking
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="furnished"
              type="checkbox"
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.furnished}
              onChange={handleChange}
            />
            <label htmlFor="furnished" className="ml-2 text-lg font-medium">
              Furnished
            </label>
          </div>
        </div>

        {/* Type & Offer */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-lg font-medium mb-2">
              Type
            </label>
            <select
              id="type"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.type}
            >
              <option>Rent</option>
              <option>Sale</option>
            </select>
          </div>
          <div className="flex items-center mt-6">
            <input
              id="offer"
              type="checkbox"
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.offer}
              onChange={handleChange}
            />
            <label htmlFor="offer" className="ml-2 text-lg font-medium">
              Offer Available
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-lg font-medium mb-2">
            Upload Images
          </label>
          <div className="flex gap-3">
            <input
              onChange={(e) => setfiles(e.target.files)}
              id="images"
              type="file"
              multiple
              accept="image/*"
              className="w-full text-gray-600 rounded-2xl border p-2"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {/* Image Previews */}
          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-32 rounded-xl object-contain"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            disabled={loading || uploading }
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Creating.." : "Create Listing"}
          </button>
         {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
