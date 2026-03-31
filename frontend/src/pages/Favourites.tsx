import { Link } from "react-router";
import Navbar from "../components/Navbar";

const MOCK_FAVOURITES = [
  {
    id: 1,
    title: "Luxury Penthouse",
    location: "Downtown Manhattan, New York",
    price: 2_850_000,
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    type: "Penthouse",
  },
  {
    id: 3,
    title: "Modern Beach Villa",
    location: "Malibu, California",
    price: 4_200_000,
    imageUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    type: "Villa",
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 3_100_000,
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    type: "Cabin",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const Favourites = () => {
  const favourites = MOCK_FAVOURITES;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-white text-2xl font-semibold">Favourites</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {favourites.length} saved{" "}
            {favourites.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Empty state */}
        {favourites.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-zinc-600 text-sm mb-4">
              You haven't saved any properties yet.
            </p>
            <Link
              to="/dashboard"
              className="text-white text-sm underline underline-offset-4"
            >
              Browse properties
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favourites.map((property) => (
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
                    {/* Saved heart */}
                    <div className="absolute top-3 right-3 w-7 h-7 bg-zinc-900/80 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
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

            {/* Browse more */}
            <div className="mt-10 pt-8 border-t border-zinc-900">
              <Link
                to="/dashboard"
                className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
              >
                Browse more properties &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favourites;
