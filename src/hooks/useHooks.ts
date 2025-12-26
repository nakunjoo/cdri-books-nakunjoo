import { searchBooks } from "../api/search";
import { searchHistoryApi } from "../api/history";
import { likeBookApi } from "../api/like";
import type { BooksData } from "../types/Books";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface SearchData {
  search: string;
  detail: boolean;
  target: string;
}

export const useSearch = (searchData: SearchData) => {
  return useInfiniteQuery({
    queryKey: [
      "books",
      searchData.search,
      searchData.target,
      searchData.detail,
    ],
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
  });
};

export const useHistory = () => {
  const queryClient = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: searchHistoryApi.getHistory,
  });

  const setSearchHistory = useMutation({
    mutationFn: searchHistoryApi.setHistory,
    onSuccess: (history: string[]) => {
      queryClient.setQueryData(["searchHistory"], history);
    },
  });

  const deleteHistory = useMutation({
    mutationFn: searchHistoryApi.deleteHistory,
    onSuccess: (history: string[]) => {
      queryClient.setQueryData(["searchHistory"], history);
    },
  });

  return {
    history,
    setHistory: setSearchHistory.mutate,
    deleteHistory: deleteHistory.mutate,
  };
};

export const useLike = () => {
  const queryClient = useQueryClient();

  const { data: allLikeBooks = [] } = useQuery<BooksData[]>({
    queryKey: ["allLikeBooks"],
    queryFn: likeBookApi.getLikes,
  });

  const likeBooks = useInfiniteQuery({
    queryKey: ["likeBooks"],
    queryFn: ({ pageParam = 1 }) => likeBookApi.getLikesPagination(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const isEnd = lastPage.meta.is_end;
      if (isEnd) return undefined;

      return allPages.length + 1;
    },
    retry: false,
    enabled: true,
    initialPageParam: 1,
  });

  const toggleLike = useMutation({
    mutationFn: likeBookApi.toggleLike,
    onSuccess: (newLike: BooksData[]) => {
      queryClient.setQueryData(["allLikeBooks"], newLike);
      queryClient.refetchQueries({ queryKey: ["likeBooks"] });
    },
  });

  const isLikes = (book: BooksData) => {
    return allLikeBooks.some(
      (item) =>
        item.isbn === book.isbn &&
        item.title === book.title &&
        item.datetime === book.datetime
    );
  };

  return {
    likeBooks,
    toggleLike: toggleLike.mutate,
    isLikes,
  };
};
