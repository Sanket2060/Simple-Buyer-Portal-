import { useQuery } from "@tanstack/react-query";
import { getAllProperties, getPropertyById } from "../api/properties";
import { queryKeys } from "../lib/queryKeys";

export const useProperties = () =>
  useQuery({
    queryKey: queryKeys.properties.all,
    queryFn: getAllProperties,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useProperty = (id: number) =>
  useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
