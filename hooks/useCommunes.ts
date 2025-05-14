import { useQuery } from "@tanstack/react-query";
import { getCommunes } from "@/api";
import { useStoreApp } from "@/store";

const useCommunes = () => {
  const store = useStoreApp((state) => state);
  const { data, error, isError } = useQuery({
    queryKey: ["communes", store?.token],
    queryFn: async () => await getCommunes(store?.token),
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
    list: data.map((item: any) => ({
      _id: String(item?.id),
      value: String(item?.libelle),
    })),
    error: "",
  };
};

export default useCommunes;
