import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllVisitByDate } from "@/api";
import { useStoreApp } from "@/store";

const useAllVisitByDate = (date: Date) => {
  const token = useStoreApp((state) => state.token);

  const current_date = date?.toISOString().split("T")[0];

  const fetchVisit = async ({ pageParam }: { pageParam: number }) => {
    const req = await getAllVisitByDate(current_date, token, pageParam);
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
    queryKey: ["visit_date", current_date],
    queryFn: fetchVisit,
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

export default useAllVisitByDate;
