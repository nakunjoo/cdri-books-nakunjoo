import type { BooksData } from "../types/Books";

export const likeBookApi = {
  getLikes: () => {
    const likes = localStorage.getItem("likeBooks");
    return likes ? JSON.parse(likes) : [];
  },
  toggleLike: async (book: BooksData): Promise<BooksData[]> => {
    const likes: BooksData[] = likeBookApi.getLikes();
    const find = likes.find(
      (item) =>
        item.isbn === book.isbn &&
        item.title === book.title &&
        item.datetime === book.datetime
    );
    const newLike: BooksData[] = find
      ? likes.filter(
          (item) =>
            !(
              item.isbn === book.isbn &&
              item.title === book.title &&
              item.datetime === book.datetime
            )
        )
      : [book, ...likes];

    localStorage.setItem("likeBooks", JSON.stringify(newLike));
    return newLike;
  },

  getLikesPagination: async (page: number) => {
    const pageSize = 10;
    const allLikes: BooksData[] = likeBookApi.getLikes();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      documents: allLikes.slice(start, end) || [],
      meta: {
        is_end: end >= allLikes.length,
        pageable_count: allLikes.length,
        total_count: allLikes.length,
      },
    };
  },
};
