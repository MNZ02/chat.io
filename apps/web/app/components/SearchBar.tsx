import React from 'react'
import { Search } from 'lucide-react'
function SearchBar() {
    return (
        <div>
            {/* Search bar */}
            <div className="flex gap-2 mt-3 bg-gray-200 p-2 ml-2 mr-2 rounded-md">
                <Search className="text-gray-600" />

                <input type="text" placeholder="Search" className="text-gray-600 outline-none" />
            </div>
        </div>
    )
}

export default SearchBar
