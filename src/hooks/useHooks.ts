import { searchBooks } from "../api/search";
import { useInfiniteQuery } from "@tanstack/react-query";

interface SearchData {
  search: string;
  detail: boolean;
  target: string;
}

export const useSearch = (searchData: SearchData) => {
  return useInfiniteQuery({
    queryKey: ["books", searchData.search],
    queryFn: ({ pageParam = 1 }) =>
      searchBooks({ ...searchData, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) => {
      const isEnd = lastPage.meta.is_end;
      if (isEnd) return undefined;

      return allPages.length + 1;
    },
    retry: false,
    enabled: false,
    initialPageParam: 1,
    // initialData: {
    //   documents: [],
    //   meta: {
    //     total_count: 0,
    //     pageable_count: 0,
    //     is_end: true,
    //   },
    // },
  });
};
