import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Star, Search, Filter, Store, ChevronDown } from "lucide-react";
import axios from "axios";

interface Shop {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  rating: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  description: string;
  distance?: string;
}

const CATEGORIES = ["All", "Seeds", "Fertilizers", "Pesticides", "Equipment", "Feed & Fodder", "Veterinary"];

const categoryColors: Record<string, string> = {
  Seeds: "bg-green-100/80 text-green-700 border border-green-200/50",
  Fertilizers: "bg-yellow-100/80 text-yellow-700 border border-yellow-200/50",
  Pesticides: "bg-red-100/80 text-red-700 border border-red-200/50",
  Equipment: "bg-blue-100/80 text-blue-700 border border-blue-200/50",
  "Feed & Fodder": "bg-orange-100/80 text-orange-700 border border-orange-200/50",
  Veterinary: "bg-purple-100/80 text-purple-700 border border-purple-200/50",
};

export default function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">("rating");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shops, search, selectedCategory, showOpenOnly, sortBy]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/shops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (Array.isArray(res.data)) {
        // Normalize DB fields to our UI Shop interface
        const normalizedShops = res.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          category: s.type || "All",
          address: s.address,
          phone: s.contactNumber || "N/A",
          rating: s.rating !== undefined ? s.rating : 4.5,
          isOpen: s.isOpen !== undefined ? s.isOpen : true,
          openTime: s.openTime || "08:00 AM",
          closeTime: s.closeTime || "08:00 PM",
          description: s.description || "Local agricultural supplier for quality farming needs.",
          distance: s.distance
        }));
        setShops(normalizedShops);
      } else {
        throw new Error("Invalid data received from server");
      }
    } catch (err) {
      setError("Failed to load shops. Please try again.");
      setShops([]); // Reset to empty array on error to prevent spread crashes!
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...shops];

    if (search.trim()) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (showOpenOnly) {
      result = result.filter((s) => s.isOpen);
    }

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredShops(result);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50">
        <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center shadow-inner border border-purple-200/50">
          <Store size={32} className="text-purple-700" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Find Shops</h1>
          <p className="text-gray-700 font-medium mt-1">Locate nearby agricultural shops</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] shadow-sm border border-white/50 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search shops by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-white/40 rounded-2xl bg-white/70 backdrop-blur-lg shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all font-medium"
            />
          </div>

          {/* Open Only Toggle */}
          <button
            onClick={() => setShowOpenOnly(!showOpenOnly)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all shadow-sm ${
              showOpenOnly
                ? "bg-green-500/90 text-white border-green-500 shadow-md backdrop-blur-md"
                : "bg-white/70 backdrop-blur-lg text-gray-700 border-white/40 hover:bg-white focus:ring-4 focus:ring-green-500/20"
            }`}
          >
            <Clock size={18} />
            Open Now
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center justify-between min-w-[140px] gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold border border-white/40 bg-white/70 backdrop-blur-lg text-gray-700 hover:bg-white transition-all shadow-sm focus:ring-4 focus:ring-purple-500/20"
            >
              <span className="flex items-center gap-2">
                <Filter size={18} className="text-purple-600" />
                {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl z-20 overflow-hidden">
                {["rating", "name", "distance"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt as any); setShowSortMenu(false); }}
                    className={`block w-full text-left px-5 py-3 text-sm transition-colors ${
                      sortBy === opt ? "text-purple-700 font-bold bg-purple-50/50" : "text-gray-700 font-medium hover:bg-gray-50/50"
                    }`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white/60 backdrop-blur-md text-gray-700 border-white/40 hover:bg-white hover:-translate-y-0.5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-700 mb-4 font-medium px-2">
          Showing <span className="font-extrabold text-gray-900">{filteredShops.length}</span> shops
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 animate-pulse">
              <div className="h-5 bg-white/60 rounded-md w-3/4 mb-4" />
              <div className="h-4 bg-white/50 rounded-md w-1/2 mb-3" />
              <div className="h-4 bg-white/50 rounded-md w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-700 font-medium rounded-2xl p-5 text-sm shadow-sm">
          {error}
        </div>
      )}

      {/* Shop Cards */}
      {!loading && !error && (
        <>
          {filteredShops.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/50">
              <div className="mx-auto w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4 border border-white/60 shadow-sm">
                <Store size={36} className="text-gray-400" />
              </div>
              <p className="text-lg font-bold text-gray-800">No shops found</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="group bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-4 hover:-translate-y-1 hover:bg-white"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-purple-700 transition-colors">{shop.name}</h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        {renderStars(shop.rating)}
                        <span className="text-xs font-bold text-gray-600 ml-1">{shop.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm border ${
                        shop.isOpen
                          ? "bg-green-100/90 text-green-700 border-green-200"
                          : "bg-red-100/90 text-red-600 border-red-200"
                      }`}
                    >
                      {shop.isOpen ? "OPEN" : "CLOSED"}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <span
                    className={`self-start text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                      categoryColors[shop.category] || "bg-gray-100/80 text-gray-700 border border-gray-200/50"
                    }`}
                  >
                    {shop.category}
                  </span>

                  {/* Description */}
                  {shop.description && (
                    <p className="text-sm font-medium text-gray-600 line-clamp-2 mt-1 leading-relaxed">{shop.description}</p>
                  )}

                  {/* Info */}
                  <div className="flex flex-col gap-2.5 text-sm font-medium text-gray-700 mt-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-purple-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-2 leading-tight">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-purple-600 shrink-0" />
                      <span>{shop.openTime} – {shop.closeTime}</span>
                    </div>
                    {shop.distance && (
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-gray-400 shrink-0" />
                        <span className="text-gray-500">{shop.distance} away</span>
                      </div>
                    )}
                  </div>

                  {/* Call Button */}
                  <a
                    href={`tel:${shop.phone}`}
                    className="mt-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 group-hover:shadow-lg"
                  >
                    <Phone size={18} strokeWidth={2.5} />
                    Call Shop
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
