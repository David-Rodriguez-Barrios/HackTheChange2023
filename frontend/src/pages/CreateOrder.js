import React, { useState } from 'react';

export default function CreateListing() {
  const [listing, setListing] = useState({
    sellerId: '', // This should be the UID of the logged-in user
    position: { lat: '', lng: '' },
    supplying: '',
    rate: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: value
    }));
  };

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      position: {
        ...prevListing.position,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/listings/create-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
      });

      if (response.ok) {
        // Handle successful creation
        console.log('Listing created successfully');
        // Redirect or clear form here
      } else {
        // Handle errors
        console.error('Failed to create listing');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Form fields */}
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Other fields can be added here as per your requirement */}
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            {/* Latitude Field */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="text"
                name="lat"
                id="latitude"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={listing.position.lat}
                onChange={handlePositionChange}
              />
            </div>

            {/* Longitude Field */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="text"
                name="lng"
                id="longitude"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={listing.position.lng}
                onChange={handlePositionChange}
              />
            </div>

            {/* Supplying Field */}
            <div>
              <label htmlFor="supplying" className="block text-sm font-medium text-gray-700">
                Supplying (kW)
              </label>
              <input
                type="text"
                name="supplying"
                id="supplying"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={listing.supplying}
                onChange={handleChange}
              />
            </div>

            {/* Rate Field */}
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                Rate ($/kWh)
              </label>
              <input
                type="text"
                name="rate"
                id="rate"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={listing.rate}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={listing.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Listing
        </button>
      </div>
    </form>
  );
}
