import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Luxury Penthouse",
    location: "Downtown Manhattan, New York",
    price: 2_850_000,
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  },
  {
    id: 2,
    title: "Cozy Suburban Home",
    location: "Naperville, Illinois",
    price: 485_000,
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  },
  {
    id: 3,
    title: "Modern Beach Villa",
    location: "Malibu, California",
    price: 4_200_000,
    imageUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
  },
  {
    id: 4,
    title: "Urban Studio Loft",
    location: "SoHo, San Francisco",
    price: 720_000,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    id: 5,
    title: "Classic Colonial House",
    location: "Greenwich, Connecticut",
    price: 1_350_000,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 3_100_000,
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const filtered = MOCK_PROPERTIES.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-white text-2xl font-semibold">
            Welcome back, John
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Buyer &middot; Browse available properties below.
          </p>
        </div>

        {/* Search + count row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-zinc-500 text-sm">
            {filtered.length}{" "}
            {filtered.length === 1 ? "property" : "properties"}
          </p>
          <input
            type="text"
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-zinc-600 text-sm">
              No properties match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((property) => (
              <Link
                to={`/property/${property.id}`}
                key={property.id}
                className="group block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-linear-to-t from-black/60 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white text-sm font-medium leading-snug">
                    {property.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-zinc-500 text-xs truncate pr-2">
                      {property.location}
                    </span>
                    <span className="text-zinc-300 text-xs font-medium shrink-0">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
