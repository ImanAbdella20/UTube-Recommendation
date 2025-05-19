'use client'

import { Listbox, Transition } from '@headlessui/react'
import { 
  FiChevronDown, 
  FiFilter, 
  FiClock, 
  FiCalendar, 
  FiFilm, 
  FiGlobe, 
  FiMusic, 
  FiTrendingUp,
  FiAward,
  FiMic,
  FiBook,
  FiCode,
  FiCamera,
  FiHeart,
  FiCompass,
  FiDollarSign,
  FiActivity,
  FiSearch
} from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const searchOptions = {
  languages: [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Spanish', code: 'es' },
    { id: 3, name: 'French', code: 'fr' },
    { id: 4, name: 'German', code: 'de' },
    { id: 5, name: 'Japanese', code: 'ja' },
    { id: 6, name: 'Korean', code: 'ko' },
    { id: 7, name: 'Chinese', code: 'zh' },
    { id: 8, name: 'Hindi', code: 'hi' },
    { id: 9, name: 'Arabic', code: 'ar' },
    { id: 10, name: 'Amharic', code: 'am' },
  ],
  categories: [
    {
      id: 1,
      name: 'Entertainment',
      icon: <FiFilm className="text-gray-500" />,
      subcategories: [
        { id: 101, name: 'Movies', code: 'movies' },
        { id: 102, name: 'TV Shows', code: 'tv-shows' },
        { id: 103, name: 'Celebrity News', code: 'celebrity' },
        { id: 104, name: 'Comedy', code: 'comedy' },
        { id: 105, name: 'Vlog', code: 'vlog' },
      ]
    },
    {
      id: 2,
      name: 'Music',
      icon: <FiMusic className="text-gray-500" />,
      subcategories: [
        { id: 201, name: 'Pop', code: 'pop' },
        { id: 202, name: 'Rock', code: 'rock' },
        { id: 203, name: 'Hip Hop', code: 'hip-hop' },
        { id: 204, name: 'Classical', code: 'classical' },
      ]
    },
    {
      id: 3,
      name: 'News & Politics',
      icon: <FiActivity className="text-gray-500" />,
      subcategories: [
        { id: 301, name: 'World News', code: 'world-news' },
        { id: 302, name: 'Politics', code: 'politics' },
        { id: 303, name: 'Business News', code: 'business-news' },
        { id: 304, name: 'Technology News', code: 'tech-news' },
      ]
    },
    {
      id: 4,
      name: 'Education',
      icon: <FiBook className="text-gray-500" />,
      subcategories: [
        { id: 401, name: 'Science', code: 'science' },
        { id: 402, name: 'History', code: 'history' },
        { id: 403, name: 'Mathematics', code: 'math' },
        { id: 404, name: 'Language Learning', code: 'language-learning' },
      ]
    },
    {
      id: 5,
      name: 'Technology',
      icon: <FiCode className="text-gray-500" />,
      subcategories: [
        { id: 501, name: 'Programming', code: 'programming' },
        { id: 502, name: 'AI & ML', code: 'ai-ml' },
        { id: 503, name: 'Gadgets', code: 'gadgets' },
        { id: 504, name: 'Cybersecurity', code: 'cybersecurity' },
      ]
    },
    {
      id: 6,
      name: 'Gaming',
      icon: <FiCompass className="text-gray-500" />,
      subcategories: [
        { id: 601, name: 'Gameplay', code: 'gameplay' },
        { id: 602, name: 'Walkthroughs', code: 'walkthroughs' },
        { id: 603, name: 'Esports', code: 'esports' },
        { id: 604, name: 'Reviews', code: 'game-reviews' },
      ]
    },
    {
      id: 7,
      name: 'Sports',
      icon: <FiActivity className="text-gray-500" />,
      subcategories: [
        { id: 701, name: 'Football', code: 'football' },
        { id: 702, name: 'Basketball', code: 'basketball' },
        { id: 703, name: 'Tennis', code: 'tennis' },
        { id: 704, name: 'Olympics', code: 'olympics' },
      ]
    },
  ],
  durations: [
    { id: 1, name: 'Short (<4 min)', code: 'short' },
    { id: 2, name: 'Medium (4-20 min)', code: 'medium' },
    { id: 3, name: 'Long (>20 min)', code: 'long' },
    { id: 4, name: 'Very Long (>1 hour)', code: 'very-long' },
  ],
  uploadDates: [
    { id: 1, name: 'Last 24 hours', code: 'today' },
    { id: 2, name: 'This week', code: 'week' },
    { id: 3, name: 'This month', code: 'month' },
    { id: 4, name: 'This year', code: 'year' },
    { id: 5, name: 'All time', code: 'all-time' },
  ],
  qualities: [
    { id: 1, name: 'All Qualities', code: 'all' },
    { id: 2, name: 'SD (480p)', code: 'sd' },
    { id: 3, name: 'HD (720p)', code: 'hd' },
    { id: 4, name: 'Full HD (1080p)', code: 'full-hd' },
    { id: 5, name: '4K (2160p)', code: '4k' },
    { id: 6, name: '8K (4320p)', code: '8k' },
    { id: 7, name: 'Live Streams', code: 'live' },
  ],
  contentTypes: [
    { id: 1, name: 'All Types', code: 'all' },
    { id: 2, name: 'Videos', code: 'video' },
    { id: 3, name: 'Shorts', code: 'short' },
    { id: 4, name: 'Live', code: 'live' },
    { id: 5, name: 'Premieres', code: 'premiere' },
  ]
}

export default function SearchSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({})
 

  const handleSearchChange = (filterKey: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    value ? params.set(filterKey, value) : params.delete(filterKey)
    router.push(`?${params.toString()}`, { scroll: false })
  }



  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const getCurrentSelection = (paramKey: string, options: any[]) => {
    const paramValue = searchParams.get(paramKey)
    if (!paramValue) return `Select ${paramKey}`
    const option = options.find(opt => opt.code === paramValue || opt.name === paramValue)
    return option ? option.name : `Select ${paramKey}`
  }

  const renderSearchFilter = (
    label: string,
    icon: React.ReactNode,
    paramKey: string,
    options: { id: number; name: string; code: string }[]
  ) => (
    <Listbox
      as="div"
      className="relative"
      value={searchParams.get(paramKey) || ''}
      onChange={(value) => handleSearchChange(paramKey, value)}
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
                {getCurrentSelection(paramKey, options)}
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
                    value={option.code}
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

  const renderCategoryFilter = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <FiCompass className="text-gray-500" />
          Categories
        </h3>
        <div className="space-y-1">
          {searchOptions.categories.map(category => (
            <div key={category.id} className="border rounded-md overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-2 text-left text-sm font-medium hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <FiChevronDown 
                  className={`h-4 w-4 transition-transform ${
                    expandedCategories[category.id] ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {expandedCategories[category.id] && (
                <div className="pl-8 pr-2 py-1 space-y-1 bg-gray-50">
                  {category.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSearchChange('category', sub.code)}
                      className={`w-full text-left p-1.5 text-xs rounded ${
                        searchParams.get('category') === sub.code 
                          ? 'bg-primary-blue-100 text-primary-blue' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <aside className="w-80 h-screen sticky left-0 bg-white shadow-sm p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <FiSearch className="text-primary-blue" />
        Search Options
      </h2>


      <div className="space-y-6">
        {renderSearchFilter('Content Type', <FiCamera className="text-gray-500" />, 'contentType', searchOptions.contentTypes)}
        {renderSearchFilter('Language', <FiGlobe className="text-gray-500" />, 'language', searchOptions.languages)}
        {renderCategoryFilter()}
        {renderSearchFilter('Duration', <FiClock className="text-gray-500" />, 'duration', searchOptions.durations)}
        {renderSearchFilter('Upload Date', <FiCalendar className="text-gray-500" />, 'uploadDate', searchOptions.uploadDates)}
        {renderSearchFilter('Quality', <FiFilm className="text-gray-500" />, 'quality', searchOptions.qualities)}

      </div>
    </aside>
  )
}