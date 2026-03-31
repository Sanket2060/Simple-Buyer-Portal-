import { useState } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Luxury Penthouse",
    location: "Downtown Manhattan, New York",
    price: 2_850_000,
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    type: "Penthouse",
    yearBuilt: 2019,
    description:
      "Experience unparalleled luxury living in this breathtaking penthouse perched above the iconic Manhattan skyline. This meticulously designed residence boasts floor-to-ceiling windows that flood every room with natural light and offer panoramic city views. The open-plan kitchen features top-of-the-line appliances, custom Italian cabinetry, and a waterfall island perfect for entertaining. The primary suite is a true sanctuary with a spa-inspired en-suite and a private terrace. 24/7 concierge, a rooftop pool, and a state-of-the-art fitness center are just some of the amenities included.",
  },
  {
    id: 2,
    title: "Cozy Suburban Home",
    location: "Naperville, Illinois",
    price: 485_000,
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
    type: "Single Family",
    yearBuilt: 2003,
    description:
      "Nestled in the heart of award-winning Naperville, this charming home sits on a generous corner lot in a quiet, tree-lined neighborhood. The welcoming front porch leads into a bright living room with hardwood floors and a cozy gas fireplace. The updated kitchen opens to a sunlit breakfast nook and sliding doors to a fully fenced backyard with a large deck. Located minutes from top-rated schools, Riverwalk, and the Metra train station, this turnkey home checks every box for families and first-time buyers alike.",
  },
  {
    id: 3,
    title: "Modern Beach Villa",
    location: "Malibu, California",
    price: 4_200_000,
    imageUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
    type: "Villa",
    yearBuilt: 2021,
    description:
      "Step directly onto the sand from this extraordinary Malibu beach villa, where indoor and outdoor living merge seamlessly. Expansive bi-fold glass doors open the entire main floor to the Pacific Ocean breeze, revealing a heated infinity pool and unobstructed ocean views from every vantage point. Inside, soaring ceilings and polished concrete floors create an effortlessly sophisticated backdrop for the gourmet kitchen and spacious media room. Smart-home automation controls lighting, climate, security, and entertainment throughout.",
  },
  {
    id: 4,
    title: "Urban Studio Loft",
    location: "SoHo, San Francisco",
    price: 720_000,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    type: "Loft",
    yearBuilt: 2016,
    description:
      "A stunning conversion in the heart of SoHo, this industrial-chic loft blends raw authenticity with modern comfort. Original exposed brick walls and timber ceiling beams contrast beautifully with polished concrete floors and sleek cabinetry. The open-plan layout maximises every inch, while oversized factory windows bathe the interior in golden afternoon light. Steps from world-class dining, galleries, boutiques, and transit stops, this is urban living at its most effortless.",
  },
  {
    id: 5,
    title: "Classic Colonial House",
    location: "Greenwich, Connecticut",
    price: 1_350_000,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    type: "Colonial",
    yearBuilt: 1998,
    description:
      "Set on a beautifully landscaped half-acre in one of Greenwich's most sought-after neighborhoods, this stately colonial home exudes timeless curb appeal. The two-story entry foyer opens to formal living and dining rooms with crown molding and wainscoting. A chef's kitchen with marble countertops flows into a casual family room with a wood-burning fireplace. The manicured backyard features a bluestone patio and mature specimen trees. Minutes from top private schools and Metro-North.",
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    location: "Aspen, Colorado",
    price: 3_100_000,
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80",
    type: "Cabin",
    yearBuilt: 2017,
    description:
      "Escape to this extraordinary mountain retreat just minutes from Aspen's world-famous ski slopes. Crafted from reclaimed timber and local stone, the architecture pays homage to its breathtaking Rocky Mountain setting while delivering every contemporary comfort. Soaring vaulted ceilings and a dramatic two-story stone fireplace anchor the great room, which spills onto a wraparound deck with sweeping mountain views. A private hot tub on the lower terrace is the perfect après-ski reward.",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const Property = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavourited, setIsFavourited] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const property = MOCK_PROPERTIES.find((p) => p.id === Number(id));

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleFavourite = () => {
    const next = !isFavourited;
    setIsFavourited(next);
    showToast(next ? "Added to favourites." : "Removed from favourites.");
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-zinc-500 text-sm mb-4">Property not found.</p>
          <Link
            to="/dashboard"
            className="text-white text-sm underline underline-offset-4"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Toast */}
      <div
        className={`fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 ${
          toastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {toastMessage}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link
            to="/dashboard"
            className="hover:text-zinc-400 transition-colors"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left — image + description */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero Image */}
            <div className="rounded-xl overflow-hidden aspect-4/3">
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-3">
                About
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* Right — info card */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-20">
              {/* Price */}
              <p className="text-white text-2xl font-semibold mb-1">
                {formatPrice(property.price)}
              </p>

              <div className="border-t border-zinc-800 my-5" />

              {/* Title & location */}
              <h1 className="text-white text-base font-medium leading-snug mb-1">
                {property.title}
              </h1>
              <p className="text-zinc-500 text-sm">{property.location}</p>

              <div className="border-t border-zinc-800 my-5" />

              {/* Details */}
              <ul className="space-y-3 mb-6">
                {[
                  { label: "Type", value: property.type },
                  { label: "Year built", value: property.yearBuilt },
                ].map(({ label, value }) => (
                  <li
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-zinc-200">{value}</span>
                  </li>
                ))}
              </ul>

              {/* Favourite button */}
              <button
                onClick={handleFavourite}
                className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-colors ${
                  isFavourited
                    ? "bg-white text-zinc-900 hover:bg-zinc-100"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isFavourited ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                {isFavourited ? "Saved to Favourites" : "Add to Favourites"}
              </button>

              {/* Back */}
              <Link
                to="/dashboard"
                className="mt-3 w-full flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-2"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
