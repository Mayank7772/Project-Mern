import { useState, useEffect } from "react";
import { FaBath, FaBed, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: "false",
    furnished: "false",
    offer: "false",
    sort: "created_at",
    order: "desc",
  });
  const [loading , setLoading] = useState(false);
  const [listings , setListings] = useState([]);

  const navigate = useNavigate();

  console.log("Sidebar Data:", sidebardata);
  console.log("Listings:", listings);

  // Function to handle input change event in the sidebar filters
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.id === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort: sort, order: order });
    }
  };

  // Function to handle form submission event
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
    }

    fetchListings();

  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters as Form */}
        <aside className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Search Term */}
            <div>
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-gray-700"
              >
                Search Term:
              </label>
              <input
                id="searchTerm"
                name="searchTerm"
                type="text"
                placeholder="Enter keyword"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={sidebardata.searchTerm}
              />
            </div>

            {/* Type */}
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                Type
              </legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    name="typeAll"
                    id="all"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600"
                    onChange={handleChange}
                    checked={sidebardata.type === "all"}
                  />
                  <span className="ml-2 text-gray-700">Rent & Sale</span>
                </label>
                <label className="flex items-center">
                  <input
                    name="typeRent"
                    type="checkbox"
                    id="rent"
                    className="h-4 w-4 text-blue-600"
                    onChange={handleChange}
                    checked={sidebardata.type === "rent"}
                  />
                  <span className="ml-2 text-gray-700">Rent</span>
                </label>
                <label className="flex items-center">
                  <input
                    name="typeSale"
                    type="checkbox"
                    id="sale"
                    onChange={handleChange}
                    checked={sidebardata.type === "sale"}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Sale</span>
                </label>
                <label className="flex items-center">
                  <input
                    name="typeOffer"
                    type="checkbox"
                    id="offer"
                    onChange={handleChange}
                    checked={sidebardata.offer}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Offer</span>
                </label>
              </div>
            </fieldset>

            {/* Amenities */}
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">
                Amenities
              </legend>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    name="amenityParking"
                    type="checkbox"
                    id="parking"
                    onChange={handleChange}
                    checked={sidebardata.parking}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Parking</span>
                </label>
                <label className="flex items-center">
                  <input
                    name="amenityFurnished"
                    type="checkbox"
                    id="furnished"
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Furnished</span>
                </label>
              </div>
            </fieldset>

            {/* Sort */}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700"
              >
                Sort:
              </label>
              <select
                id="sort_order"
                name="sort"
                onChange={handleChange}
                defaultValue={"created_at_desc"}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={"createdAt_desc"}>Latest</option>
                <option value={"createdAt_asc"}>Oldest</option>
                <option value={"regularPrice_asc"}>Price: Low to High</option>
                <option value={"regularPrice_desc"}>Price: High to Low</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              SEARCH
            </button>
          </form>
        </aside>

        {/* Results */}
        <section className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-semibold">Listing results:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Card 1 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src="https://picsum.photos/id/1018/400/250"
                alt="Example"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium">Beautiful Home</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>123 Maple Avenue</span>
                </div>
                <p className="text-gray-700">
                  Cozy modern house in a quiet neighborhood.
                </p>
                <div className="flex items-center justify-between text-gray-800 font-semibold">
                  <span>$400 / month</span>
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <FaBed className="mr-1" /> 3
                    </span>
                    <span className="flex items-center">
                      <FaBath className="mr-1" /> 2
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Additional cards can be mapped here... */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Search;
