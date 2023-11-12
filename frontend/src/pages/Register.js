import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Register = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [location, setLocation] = useState({ Latitude: '', Longitude: '' });
const [role, setRole] = useState('');
const [password, setPassword] = useState('');
const history = useHistory();

const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => ({
    ...prevLocation,
    [name]: value
    }));
};

const handleRegister = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        Name: name,
        Email: email,
        Location: {
            Latitude: parseFloat(location.Latitude),
            Longitude: parseFloat(location.Longitude)
        },
        Role: role,
        Password: password 
        }),
    });

    const data = await response.json();
    // Handle the response data
    console.log(data);
    history.push('/listing');
    } catch (error) {
    // Handle errors
    console.error(error);
    }
};

return (
    <>
    <div className="min-h-full mt-50">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 mt-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
                <img
                className="h-12 w-auto"
                src="https://img.icons8.com/ios-filled/50/electro-devices.png?color=indigo&shade=600"
                alt="Your Company"
                />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign Up a new account</h2>
                <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Login
                </a>
                </p>
            </div>
            <div className="mt-8">
            <form action="#" method="POST" className="space-y-6" onSubmit={handleRegister}>
                {/* New input fields */}
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <div className="mt-1">
                    <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                </div>
                <div>
                <label htmlFor="location-latitude" className="block text-sm font-medium text-gray-700">
                    Location Latitude
                </label>
                <div className="mt-1">
                    <input
                    id="location-latitude"
                    name="Latitude"
                    type="text"
                    autoComplete="location-latitude"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={location.Latitude}
                    onChange={handleLocationChange}
                    />
                </div>
                </div>
                <div>
                <label htmlFor="location-longitude" className="block text-sm font-medium text-gray-700">
                    Location Longitude
                </label>
                <div className="mt-1">
                    <input
                    id="location-longitude"
                    name="Longitude"
                    type="text"
                    autoComplete="location-longitude"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={location.Longitude}
                    onChange={handleLocationChange}
                    />
                </div>
                </div>
                <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                </label>
                <select
                    id="role"
                    name="role"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">Select Role</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
                </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </div>
                <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Sign Up
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
            <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
            />
        </div>
    </div>
    </>
);
}

export default Register;
