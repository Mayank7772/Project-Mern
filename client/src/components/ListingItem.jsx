import React from 'react';
import { FaBath, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Now accepts a single `listing` prop instead of an array
const ListingItem = ({ listing }) => {
  if (!listing) {
    return <p className="text-center text-gray-500">No listing provided.</p>;
  }

  return (
    <div >
      <Link to={`/listing/${listing._id}`}>  
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 space-y-2">
        <Link to={`/listing/${listing._id}`}>
          <h3 className="text-lg font-medium hover:text-blue-600 transition">
            {listing.name}
          </h3>
        </Link>
        <div className="flex items-center text-gray-600 text-sm">
          <FaMapMarkerAlt className="mr-1" />
          <span>{listing.address}</span>
        </div>
        <p className="text-gray-700 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between text-gray-800 font-semibold">
          <span>
            ${listing.regularPrice}
            {listing.type === 'rent' && ' / month'}
          </span>
          <div className="flex space-x-4">
            <span className="flex items-center">
              <FaBed className="mr-1" /> {listing.bedrooms}
            </span>
            <span className="flex items-center">
              <FaBath className="mr-1" /> {listing.bathrooms}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
