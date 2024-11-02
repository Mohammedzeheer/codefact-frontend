import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addStudio } from '../store/slices/studioSlice';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const AddStudio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerHour: '',
    amenities: [],
    contactEmail: '',
    contactPhone: '',
    image: '',
  });

  // ... keep all the handlers the same ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const CLOUDINARY_CLOUD_NAME = 'dah6aafle';
  const CLOUDINARY_UPLOAD_PRESET = 'codefact';
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      setUploadProgress(0);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${errorData}`);
      }

      setUploadProgress(70);
      const data = await response.json();

      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          image: data.secure_url
        }));
        setUploadProgress(100);
      } else {
        throw new Error('No secure URL in response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({
        ...prev,
        image: `Failed to upload image: ${error.message}`
      }));
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    setUploadProgress(0);
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, amenities: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await dispatch(addStudio(formData)).unwrap();
      navigate('/studios');
    } catch (error) {
      setErrors(error.response?.data?.errors || {
        submit: error.response?.data?.message || 'Failed to add studio. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (name, label, type = 'text', required = true) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full p-2 border ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  const ImageUploadSection = () => (
    <Card className="h-full border-2 border-dashed border-gray-300 rounded-lg">
      <CardContent className="p-6">
        {!imagePreview ? (
          <div className="flex flex-col items-center justify-center h-full min-h-96">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-600">
                Click to upload studio image
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </span>
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Studio preview"
              className="w-full h-96 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            {uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
                Uploading... {uploadProgress}%
              </div>
            )}
          </div>
        )}
        {errors.image && (
          <p className="mt-2 text-sm text-red-500">{errors.image}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/studios')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Studio</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errors.submit && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Studio Image</h2>
              <ImageUploadSection />
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('name', 'Studio Name')}
                  {renderField('location', 'Location')}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-2 border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Pricing */}
              {renderField('pricePerHour', 'Price per Hour (₹)', 'number')}

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities.join(', ')}
                  onChange={handleAmenitiesChange}
                  placeholder="e.g., Lighting equipment, Backdrop, Makeup room"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('contactEmail', 'Email', 'email')}
                  {renderField('contactPhone', 'Phone', 'tel')}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Adding Studio...' : 'Add Studio'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudio;


