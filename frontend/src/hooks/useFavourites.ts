import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
} from "../api/favourites";
import { queryKeys } from "../lib/queryKeys";
import type { Favourite } from "../types";

// ─── Query ────────────────────────────────────────────────────────────────────

export const useFavourites = () =>
  useQuery({
    queryKey: queryKeys.favourites.all,
    queryFn: getFavourites,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

// ─── Derived helper — set of favourited propertyIds ──────────────────────────

export const useFavouriteIds = (): Set<number> => {
  const { data } = useFavourites();
  return new Set((data ?? []).map((f) => f.propertyId));
};

// ─── Add favourite ────────────────────────────────────────────────────────────

export const useAddFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => addFavourite({ propertyId }),

    // Optimistic update — immediately add a placeholder favourite to the cache
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites.all });

      const previous = queryClient.getQueryData<Favourite[]>(
        queryKeys.favourites.all,
      );

      queryClient.setQueryData<Favourite[]>(queryKeys.favourites.all, (old) => {
        const optimistic: Favourite = {
          id: -1, // temporary sentinel — replaced on refetch
          userId: -1,
          propertyId,
          property: { id: propertyId, title: "", location: "", imageUrl: "", price: 0 },
        };
        return old ? [...old, optimistic] : [optimistic];
      });

      return { previous };
    },

    // Roll back on error
    onError: (_err, _propertyId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.favourites.all, context.previous);
      }
    },

    // Always refetch to get the real server state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favourites.all });
    },
  });
};

// ─── Remove favourite ─────────────────────────────────────────────────────────

export const useRemoveFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => removeFavourite(propertyId),

    // Optimistic update — immediately remove from cache
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites.all });

      const previous = queryClient.getQueryData<Favourite[]>(
        queryKeys.favourites.all,
      );

      queryClient.setQueryData<Favourite[]>(queryKeys.favourites.all, (old) =>
        old ? old.filter((f) => f.propertyId !== propertyId) : [],
      );

      return { previous };
    },

    // Roll back on error
    onError: (_err, _propertyId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.favourites.all, context.previous);
      }
    },

    // Always refetch to get the real server state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favourites.all });
    },
  });
};
