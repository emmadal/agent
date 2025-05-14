import { useQuery } from "@tanstack/react-query";
import { getCoworkers } from "@/api";
import { useStoreApp } from "@/store";

// custom hooks to get the list my coworkers in my active team
const useTeam = () => {
  const store = useStoreApp((state) => state);
  const { data, error, isError, isPending, refetch } = useQuery({
    queryKey: ["team", store?.team?.team_id],
    queryFn: async () => await getCoworkers(store?.team?.team_id, store?.token),
  });
  return { data, isPending, error, isError, refetch };
};

export default useTeam;
