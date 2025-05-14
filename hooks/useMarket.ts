import { useQuery } from "@tanstack/react-query";
import { getAllStoreByPerson } from "@/api";
import { useStoreApp } from "@/store";

// custom hooks to get the list my coworkers in my active team
const useMarket = () => {
  const store = useStoreApp((state) => state);
  const { data, error, isError, isPending, refetch } = useQuery({
    queryKey: ["market", store?.token],
    queryFn: async () => await getAllStoreByPerson(store?.token),
  });
  return { data, isPending, error, isError, refetch };
};

export default useMarket;
