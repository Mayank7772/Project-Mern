import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { FaBed, FaBath, FaParking, FaChair, FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineLocalOffer } from 'react-icons/md';
import ContactOwner from './ContactOwner';

const Listing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${id}`);
        if (!res.ok) throw new Error('Could not load listing');
        setListing(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Carousel */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg overflow-hidden h-64"
      >
        {listing.imageUrls.map((url, idx) => (
          <SwiperSlide key={idx}>
            <img src={url} alt={`Slide ${idx}`} className="w-full h-64 object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Header: Title & Price */}
      <div>
        <h1 className="text-2xl font-bold inline">{listing.name}</h1>
        <span className="ml-4 text-xl font-semibold">$ {listing.regularPrice}</span>
      </div>

      {/* Address */}
      <div className="flex items-center text-gray-600">
        <FaMapMarkerAlt className="mr-2" />
        <p>{listing.address}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center bg-red-600 text-white px-3 py-1 rounded-full">
          <MdOutlineLocalOffer className="mr-1" /> For {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
        </span>
        {listing.offer && (
          <span className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full">
            <MdOutlineLocalOffer className="mr-1" /> $ {listing.regularPrice - listing.discountPrice} Discount
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="font-semibold mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
      </div>

      {/* Specs */}
      <div className="flex flex-wrap gap-6 text-gray-700">
        <div className="flex items-center">
          <FaBed className="mr-1" />
          <span>{listing.bedrooms} Beds</span>
        </div>
        <div className="flex items-center">
          <FaBath className="mr-1" />
          <span>{listing.bathrooms} Baths</span>
        </div>
        <div className="flex items-center">
          <FaParking className="mr-1" />
          <span>{listing.parking ? 'Parking' : 'No parking'}</span>
        </div>
        <div className="flex items-center">
          <FaChair className="mr-1" />
          <span>{listing.furnished ? 'Furnished' : 'Not furnished'}</span>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-6">
        <ContactOwner listing={listing}/>
      </div>
    </main>
  );
};

export default Listing;
