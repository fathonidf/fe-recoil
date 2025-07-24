"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, ShoppingCart, ChevronDown } from "lucide-react"
import { useAuthContext } from "@/contexts/AuthContext"

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState("Browse Product")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, user } = useAuthContext()

  const tabs = [
    "Browse Product",
    "My Store", 
    "Transactions",
    "Messages"
  ]

  const categories = [
    "All Categories",
    "Cooking Oil",
    "Motor Oil",
    "Paint",
    "Others"
  ]

  return (
    <div className="min-h-screen pt-10 relative overflow-hidden">
        {/* Background blur blobs */}
              <div className="absolute -left-100 top-0 z-0">
                <Image
                  src="/landing_page/blur blob.svg"
                  alt=""
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="absolute -right-100 top-0 z-0">
                <Image
                  src="/landing_page/blur blob.svg"
                  alt=""
                  width={1000}
                  height={1000}
                  className="rotate-180"
                />
              </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
            Small Actions, Big Impact!
          </h1>
          <p className="text-lg italic text-gray-600 max-w-2xl mx-auto">
            Connect, exchange, and recycle quality liquid waste effortlessly!
          </p>
        </div>

        {/* Tab Navigation */}
            <div className="mb-8 relative z-20">
              <div className="bg-white rounded-xl p-2 shadow-sm max-w-6xl mx-auto">
                <div className="grid grid-cols-4 gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center cursor-pointer ${
                        activeTab === tab
                          ? "bg-[#04BB84] text-white shadow-[0_4px_8px_rgba(4,187,132,0.3)] transform translate-y-[-2px] border-b-4 border-[#039970]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#04BB84]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8 relative z-20">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Search Bar */}
                  <div className="relative flex-1 w-full bg-white rounded-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#04BB84] w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#04BB84] text-[#04BB84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BB84] focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* My Cart Button */}
                    <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-[#04BB84] text-[#04BB84] rounded-lg hover:bg-[#04BB84] hover:text-white transition-all duration-300 whitespace-nowrap">
                      <ShoppingCart className="w-4 h-4" />
                      <span>My Cart</span>
                    </button>

                    {/* Categories Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="cursor-pointer text-[#04BB84] flex items-center gap-2 px-4 py-2 bg-white border border-[#04BB84] rounded-lg hover:bg-gray-50 transition-all duration-300 min-w-[160px] justify-between whitespace-nowrap"
                      >
                        <span>{selectedCategory}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 z-50 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category)
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-300 transition-colors first:rounded-t-lg last:rounded-b-lg z-50 cursor-pointer ${
                                selectedCategory === category ? 'bg-[#04BB84] text-white hover:bg-[#04BB84]' : 'text-gray-700'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Conditional Content Based on Authentication */}
        {!isAuthenticated ? (
          // Not Logged In - Show Sign In Prompt Only
          
          <div className="text-center py-16 relative z-10">
            <div className="max-w-md mx-auto mb-8">
              <Image
                src="/exchange_page/exchange please sign in.svg"
                alt="Please sign in illustration"
                width={400}
                height={300}
                className="w-full h-auto"
                priority
              />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
              Please sign in to view your Store
            </h2>
          </div>
        ) : (
          // Logged In - Show Full Exchange Interface
          <>
            {/* Product Cards Grid */}
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">🛢️</span>
                      </div>
                      <p className="text-gray-600 text-sm">Cooking Oil</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Used Cooking Oil - 5L</h3>
                    <p className="text-gray-600 text-sm mb-3">High quality used cooking oil suitable for recycling</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#04BB84] font-bold">$15.00</span>
                      <button className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">⚙️</span>
                      </div>
                      <p className="text-gray-600 text-sm">Motor Oil</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Used Motor Oil - 2L</h3>
                    <p className="text-gray-600 text-sm mb-3">Clean used motor oil for industrial recycling</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#04BB84] font-bold">$8.50</span>
                      <button className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">🎨</span>
                      </div>
                      <p className="text-gray-600 text-sm">Paint</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Latex Paint - 1L</h3>
                    <p className="text-gray-600 text-sm mb-3">Unused latex paint, various colors available</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#04BB84] font-bold">$12.00</span>
                      <button className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">🧪</span>
                      </div>
                      <p className="text-gray-600 text-sm">Chemical</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Industrial Solvent - 3L</h3>
                    <p className="text-gray-600 text-sm mb-3">Clean industrial solvent for reuse</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#04BB84] font-bold">$25.00</span>
                      <button className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 5 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-xl">🔋</span>
                      </div>
                      <p className="text-gray-600 text-sm">Battery Acid</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Battery Acid - 1.5L</h3>
                    <p className="text-gray-600 text-sm mb-3">Used battery acid for proper recycling</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#04BB84] font-bold">$6.00</span>
                      <button className="bg-[#04BB84] text-white px-3 py-1 rounded text-sm hover:bg-[#039970] transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
