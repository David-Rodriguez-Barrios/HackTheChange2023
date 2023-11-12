import React, { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

// Dummy data for listings
const listingsData = [
  {
    id: 1,
    seller: 'User123',
    location: 'New York, USA',
    rate: '5.3',
    amount: '100 - 500 USD'
  },
  // ... more listings
];

// Dummy data for filters (can be dynamic based on your actual data)
const filters = [
  { name: 'Location', current: 'Worldwide' },
  { name: 'Currency', current: 'USD' },
  // ... more filters
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Listings() {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter dropdown */}
        <Listbox value={selectedFilter} onChange={setSelectedFilter}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700">Filter by</Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <span className="block truncate">{selectedFilter.current}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ArrowLongRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options static className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filters.map((filter) => (
                      <Listbox.Option
                        key={filter.name}
                        className={({ active }) =>
                          classNames(
                            active ? 'text-white bg-indigo-600' : 'text-gray-900',
                            'cursor-default select-none relative py-2 pl-3 pr-9'
                          )
                        }
                        value={filter}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                              {filter.name}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>

        {/* Listings */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listingsData.map((listing) => (
            <div key={listing.id} className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h5 className="text-lg font-bold">{listing.seller}</h5>
                  <p className="text-sm text-gray-600">{listing.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Rate</div>
                  <div className="text-lg font-bold">{listing.rate}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-500">Amount</div>
                <div className="text-lg font-bold">{listing.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
