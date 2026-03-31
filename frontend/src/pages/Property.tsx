import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useProperty } from "../hooks/useProperties";
import {
  useFavouriteIds,
  useAddFavourite,
  useRemoveFavourite,
} from "../hooks/useFavourites";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

// ─── Toast ─────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast = ({ message, visible }: ToastProps) => (
  <div
    className={`fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 ${
      visible
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }`}
  >
    {message}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PropertySkeleton = () => (
  <div className="min-h-screen bg-zinc-950">
    <div className="max-w-6xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-4 bg-zinc-800 rounded w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-xl overflow-hidden aspect-4/3 bg-zinc-800" />
          <div className="space-y-3">
            <div className="h-3 bg-zinc-800 rounded w-16" />
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-zinc-800 rounded w-4/6" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
            <div className="h-7 bg-zinc-800 rounded w-32" />
            <div className="border-t border-zinc-800" />
            <div className="h-5 bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-800 rounded w-1/2" />
            <div className="border-t border-zinc-800" />
            <div className="space-y-3">
              <div className="h-4 bg-zinc-800 rounded" />
              <div className="h-4 bg-zinc-800 rounded" />
            </div>
            <div className="h-10 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Property = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);

  const { data: property, isLoading, isError, error } = useProperty(propertyId);
  const favouriteIds = useFavouriteIds();

  const { mutate: addFav, isPending: isAdding } = useAddFavourite();
  const { mutate: removeFav, isPending: isRemoving } = useRemoveFavourite();

  const isFavourited = favouriteIds.has(propertyId);
  const isMutating = isAdding || isRemoving;

  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3000,
    );
    return () => clearTimeout(timer);
  }, [toast.visible]);

  const handleFavourite = () => {
    if (isMutating) return;

    if (isFavourited) {
      removeFav(propertyId, {
        onSuccess: () => showToast("Removed from favourites."),
        onError: (err) => showToast(err.message),
      });
    } else {
      addFav(propertyId, {
        onSuccess: () => showToast("Added to favourites."),
        onError: (err) => showToast(err.message),
      });
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-zinc-950">
          <Navbar />
          <PropertySkeleton />
        </div>
      </>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-zinc-500 text-sm mb-4">
            {isError
              ? (error?.message ?? "Failed to load property.")
              : "Property not found."}
          </p>
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

  // ── Property detail ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <Toast message={toast.message} visible={toast.visible} />

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
          <span className="text-zinc-400 truncate">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero image */}
            <div className="rounded-xl overflow-hidden aspect-4/3">
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-3">
                  About
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right column — sticky info card ─────────────────────────────── */}
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
                  { label: "Location", value: property.location },
                  { label: "Price", value: formatPrice(property.price) },
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
                disabled={isMutating}
                className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  isFavourited
                    ? "bg-white text-zinc-900 hover:bg-zinc-100"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {isMutating ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
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
                )}
                {isMutating
                  ? isFavourited
                    ? "Removing…"
                    : "Saving…"
                  : isFavourited
                    ? "Saved to Favourites"
                    : "Add to Favourites"}
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
