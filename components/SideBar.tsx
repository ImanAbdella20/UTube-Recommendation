'use client'

import { Listbox, Transition } from '@headlessui/react'
import { FiChevronDown, FiFilter, FiClock, FiCalendar, FiFilm } from 'react-icons/fi'

const languages = [
  { id: 1, name: 'English' },
  { id: 2, name: 'Spanish' },
  { id: 3, name: 'French' },
  { id: 4, name: 'Amharic' },
  { id: 5, name: 'Arabic' },
]

const genres = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Gaming' },
  { id: 3, name: 'Music' },
  { id: 4, name: 'Education' },
  { id: 5, name: 'Entertainment' },
  { id: 6, name: 'Sports' },
  { id: 7, name: 'Cooking' },
  { id: 8, name: 'Travel' },
  { id: 9, name: 'Finance' },
  { id: 7, name: 'Podcast' }
]

const durations = [
  { id: 1, name: 'Short (<4 min)' },
  { id: 2, name: 'Medium (4-20 min)' },
  { id: 3, name: 'Long (>20 min)' },
]

const uploadDates = [
  { id: 1, name: 'Today' },
  { id: 2, name: 'This week' },
  { id: 3, name: 'This month' },
  { id: 4, name: 'This year' },
]

const qualities = [
  { id: 1, name: 'All' },
  { id: 2, name: 'HD' },
  { id: 3, name: '4K' },
  { id: 4, name: 'Live' },
]

export default function Sidebar() {
  return (
    <aside className=" w-74 h-screen sticky left-0 bg-white shadow-sm p-6 ">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <FiFilter className="text-primary-blue" />
        Filters
      </h2>

      <div className="space-y-6">
        {/* Language Filter */}
        <Listbox as="div" className="relative">
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue sm:text-sm">
                  <span className="block truncate">Select language</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {languages.map((language) => (
                      <Listbox.Option
                        key={language.id}
                        value={language}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-primary-blue-100 text-primary-blue' : 'text-gray-900'
                          }`
                        }
                      >
                        {language.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>

        {/* Genre Filter */}
        <Listbox as="div" className="relative">
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue sm:text-sm">
                  <span className="block truncate">Select genre</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {genres.map((genre) => (
                      <Listbox.Option
                        key={genre.id}
                        value={genre}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-primary-blue-100 text-primary-blue' : 'text-gray-900'
                          }`
                        }
                      >
                        {genre.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>

        {/* Duration Filter */}
        <Listbox as="div" className="relative">
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiClock className="text-gray-500" />
                Duration
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue sm:text-sm">
                  <span className="block truncate">Select duration</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {durations.map((duration) => (
                      <Listbox.Option
                        key={duration.id}
                        value={duration}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-primary-blue-100 text-primary-blue' : 'text-gray-900'
                          }`
                        }
                      >
                        {duration.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>

        {/* Upload Date Filter */}
        <Listbox as="div" className="relative">
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiCalendar className="text-gray-500" />
                Upload Date
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue sm:text-sm">
                  <span className="block truncate">Select date range</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {uploadDates.map((date) => (
                      <Listbox.Option
                        key={date.id}
                        value={date}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-primary-blue-100 text-primary-blue' : 'text-gray-900'
                          }`
                        }
                      >
                        {date.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>

        {/* Quality Filter */}
        <Listbox as="div" className="relative">
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiFilm className="text-gray-500" />
                Quality
              </Listbox.Label>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue sm:text-sm">
                  <span className="block truncate">Select quality</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {qualities.map((quality) => (
                      <Listbox.Option
                        key={quality.id}
                        value={quality}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-primary-blue-100 text-primary-blue' : 'text-gray-900'
                          }`
                        }
                      >
                        {quality.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
    </aside>
  )
}