import { useQuery } from "@tanstack/react-query";
import { getVisitByDateAndStoreId } from "@/api";
import { useStoreApp } from "@/store";
import { today } from "@/lib/today";

const date = today();
const useOneVisitByDate = (storeId: string) => {
  const token = useStoreApp((state) => state.token);

  const { data, error, isError, isPending } = useQuery({
    queryKey: ["one_visit_date", date],
    queryFn: async () => await getVisitByDateAndStoreId(date, storeId, token),
  });
  return { data, isPending, error, isError };
};

export default useOneVisitByDate;
