'use client'

import { Listbox, Transition } from '@headlessui/react'
import { FiChevronDown, FiFilter, FiClock, FiCalendar, FiFilm } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'

const filters = {
  languages: [
    { id: 1, name: 'English' },
    { id: 2, name: 'Spanish' },
    { id: 3, name: 'French' },
    { id: 4, name: 'Amharic' },
    { id: 5, name: 'Arabic' },
  ],
  genres: [
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Gaming' },
    { id: 3, name: 'Music' },
    { id: 4, name: 'Education' },
    { id: 5, name: 'Entertainment' },
    { id: 6, name: 'Sports' },
    { id: 7, name: 'Cooking' },
    { id: 8, name: 'Travel' },
    { id: 9, name: 'Finance' },
    { id: 10, name: 'Podcast' },
  ],
  durations: [
    { id: 1, name: 'Short (<4 min)' },
    { id: 2, name: 'Medium (4-20 min)' },
    { id: 3, name: 'Long (>20 min)' },
  ],
  uploadDates: [
    { id: 1, name: 'Today' },
    { id: 2, name: 'This week' },
    { id: 3, name: 'This month' },
    { id: 4, name: 'This year' },
  ],
  qualities: [
    { id: 1, name: 'All' },
    { id: 2, name: 'HD' },
    { id: 3, name: '4K' },
    { id: 4, name: 'Live' },
  ],
}

export default function Sidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filterKey: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set(filterKey, value) : params.delete(filterKey)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const renderFilter = (label: string, icon: React.ReactNode, paramKey: string, options: { id: number; name: string }[]) => (
    <Listbox
      as="div"
      className="relative"
      value={searchParams.get(paramKey) || ''}
      onChange={(value) => handleFilterChange(paramKey, value)}
    >
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            {icon}
            {label}
          </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue sm:text-sm">
              <span className="block truncate">
                {searchParams.get(paramKey) || `Select ${label.toLowerCase()}`}
              </span>
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
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option.name}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-blue-100 text-primary-blue' : 'text-gray-900'
                      }`
                    }
                  >
                    {option.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )

  return (
    <aside className="w-74 h-screen sticky left-0 bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <FiFilter className="text-primary-blue" />
        Filters
      </h2>

      <div className="space-y-6">
        {renderFilter('Language', null, 'language', filters.languages)}
        {renderFilter('Genre', null, 'genre', filters.genres)}
        {renderFilter('Duration', <FiClock className="text-gray-500" />, 'duration', filters.durations)}
        {renderFilter('Upload Date', <FiCalendar className="text-gray-500" />, 'uploadDate', filters.uploadDates)}
        {renderFilter('Quality', <FiFilm className="text-gray-500" />, 'quality', filters.qualities)}
      </div>
    </aside>
  )
}
