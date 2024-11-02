import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudioById, updateStudio } from '../store/slices/studioSlice';
import { Star, MapPin, IndianRupee, Camera, Clock, Edit, Save, X } from 'lucide-react';

const StudioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentStudio, loading } = useSelector((state) => state.studio);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudio, setEditedStudio] = useState(null);

  useEffect(() => {
    dispatch(fetchStudioById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentStudio) {
      setEditedStudio(currentStudio);
    }
  }, [currentStudio]);

  if (loading || !editedStudio) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedStudio(currentStudio);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudio({
      ...editedStudio,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateStudio({ id, studioData: editedStudio })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update studio:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="border-2 rounded-lg p-1 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <h1 className="text-3xl font-bold text-gray-900">Edit Studio</h1>
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">Studio Details</h1>
              )}
            </div>

            <button
              onClick={handleEditToggle}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Studio
                </>
              )}
            </button>

          </div>

          {isEditing ? (
            // Edit Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Studio Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedStudio.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    name="location"
                    value={editedStudio.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="Hyderbad">Hyderbad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mangalore">Mangalore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Hour (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={editedStudio.pricePerHour}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={editedStudio.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editedStudio.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            // View Details
            <div className="space-y-6">
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <img
                  src={currentStudio.image || "/api/placeholder/800/400"}
                  alt={currentStudio.name}
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentStudio.name}
                  </h2>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{currentStudio.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <IndianRupee className="w-5 h-5 mr-2" />
                    <span>₹{currentStudio.pricePerHour}/hour</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    <span>
                      {currentStudio.rating} ({currentStudio.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Equipment & Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Camera className="w-5 h-5 mr-2" />
                      <span>Photography Equipment {currentStudio.amenities}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>24/7 Access</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {currentStudio.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;