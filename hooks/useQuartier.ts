import { useQuery } from "@tanstack/react-query";
import { getQuartier } from "@/api";
import { useStoreApp } from "@/store";

const useQuartier = () => {
  const store = useStoreApp((state) => state);
  const { data, error, isError } = useQuery({
    queryKey: ["quartier", store?.token],
    queryFn: async () => await getQuartier(store?.token),
  });
  if (error || isError || !data) {
    return {
      value: "",
      selectedList: [],
      list: [],
      error: error?.message,
    };
  }
  return {
    value: "",
    selectedList: [],
    list: data?.map((item: any) => ({
      _id: String(item?.id),
      value: String(item?.libelle),
    })),
    error: "",
  };
};

export default useQuartier;
