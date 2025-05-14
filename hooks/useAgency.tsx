import { useInfiniteQuery } from "@tanstack/react-query";
import { getStoreBySalePerson } from "@/api";
import { useStoreApp } from "@/store";

const useAgency = () => {
  const token = useStoreApp((state) => state.token);

  const fetchAgency = async ({ pageParam }: { pageParam: number }) => {
    const req = await getStoreBySalePerson(pageParam, token);
    return req;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ["agency"],
    queryFn: fetchAgency,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor;
    },
  });
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
    refetch,
    isFetching,
    isFetchingNextPage,
  };
};

export default useAgency;
