// ─── Query Keys ──────────────────────────────────────────────────────────────


export const queryKeys = {
  // Properties
  properties: {
    all: ["properties"] as const,
    detail: (id: number) => ["properties", id] as const,
  },

  // Favourites
  favourites: {
    all: ["favourites"] as const,
  },
} as const;
