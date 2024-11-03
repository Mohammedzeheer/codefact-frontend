import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStudios } from '../store/slices/studioSlice';
import { Star, MapPin, IndianRupee, Search, Plus } from 'lucide-react';

export default function StudioListingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 'Photo Studios', 'Conference Room', 'Dance Studio',
    'Recording Studio', 'Film Studio', 'Corporate Events'
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studios = [] } = useSelector((state) => state.studio);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    rating: '',
    searchTerm: ''
  });

  useEffect(() => {
    dispatch(fetchStudios(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">STUDIO HUB</div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                name="searchTerm"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFilterChange}
                value={filters.searchTerm}
              />
            </div>
            <button
              onClick={() => navigate('/add-studio')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Studio
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <h1 className="text-3xl font-bold">Studios</h1>
            <div>
            </div>

            {/* Location Filter */}
            <select
              name="location"
              onChange={handleFilterChange}
              value={filters.location}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Locations</option>
              <option value="Hyderbad">Hyderbad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mangalore">Mangalore</option>
            </select>

            {/* Price Range Filter */}
            <select
              name="priceRange"
              onChange={handleFilterChange}
              value={filters.priceRange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Prices</option>
              <option value="budget">Budget (₹0-₹1000)</option>
              <option value="mid">Mid-Range (₹1000-₹3000)</option>
              <option value="premium">Premium (₹3000+)</option>
            </select>

            {/* Rating Filter */}
            <select
              name="rating"
              onChange={handleFilterChange}
              value={filters.rating}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto space-x-4 mb-8 pb-4 text-sm">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filters and Studios Grid */}
        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-48 space-y-6 p-2 border-2 rounded-xl">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Price</h3>
                <button className="text-blue-500 text-sm">Reset</button>
              </div>
              {/* Price filters would go here */}
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Ratings</h3>
                <button className="text-blue-500 text-sm">Reset</button>
              </div>
              {/* Rating filters would go here */}
            </div>

            <div className="bg-white rounded-lg p-4 text-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Equipment</h3>
                <button className="text-blue-500 text-sm">Reset</button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Camera Setup
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Lighting
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Backdrops
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Grip Equipment
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Sound Equipment
                </label>

              </div>
            </div>
          </div>

          {/* Studios Grid */}
          <div className="flex-1">
            {/* <div className="grid gap-6"> */}
            <div className="grid md:grid-cols-2 gap-6">
              {studios.map((studio) => (
                <div key={studio.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Left side - Image */}
                    <div className="relative md:w-1/3">
                      <img
                        src={studio.image}
                        alt={studio.name}
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-4 right-4 p-1.5 bg-white rounded-full">
                        <Star className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Right side - Content */}
                    <div className="md:w-2/3 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-md font-semibold">{studio.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{studio.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-xs">
                        {studio.description}
                      </p>
                      <div className="flex items-center text-gray-600 mb-2 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="ml-2">{studio.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2 text-sm">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span className="ml-2 font-semibold">{studio.pricePerHour} / hr</span>
                      </div>

                      {studio.amenities && (
                        <div className="flex items-center text-gray-600 mb-2 text-sm">
                          <div className="relative">
                            <button className="p-1 bg-blue-500 rounded-full">
                              <Star className="w-3 h-3 text-white" />
                            </button>
                          </div>
                          <span className="ml-2 text-xs">Equipment Available</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-auto gap-2 text-sm">
                        <button
                          onClick={() => navigate(`/studios/${studio._id}`)}
                          className="w-full px-4 py-1 border-2 rounded-xl bg-white text-blue-500  hover:bg-blue-600 hover:text-white  transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          className="w-full px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >₹{studio.pricePerHour}/ hr
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}