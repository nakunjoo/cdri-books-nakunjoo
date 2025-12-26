import { useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "../hooks/useHooks";
import { useLike } from "../hooks/useHooks";
import BookList from "./BookList";
import SearchForm from "./SearchForm";
import { useTab } from "../contexts/TabContext";

function Container() {
  const { tab } = useTab();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [targetValue, setTargetValue] = useState<string>("");

  const { likeBooks } = useLike();

  const observerRef = useRef<HTMLDivElement>(null);

  const searchQuery = useSearch({
    search: searchValue,
    detail: isDetail,
    target: targetValue,
  });

  const activeQuery = tab === "search" ? searchQuery : likeBooks;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = activeQuery;

  const { bookList, meta } = useMemo(() => {
    if (!data?.pages) {
      return {
        bookList: [],
        meta: {
          total_count: 0,
          pageable_count: 0,
          is_end: true,
        },
      };
    }

    return {
      bookList: data.pages.flatMap((page) => page.documents),
      meta: data.pages[0]?.meta ?? {
        total_count: 0,
        pageable_count: 0,
        is_end: true,
      },
    };
  }, [data]);

  useEffect(() => {
    if (tab === "search" && searchValue) {
      searchQuery.refetch();
    }
  }, [searchValue, tab]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section>
      <div className="flex flex-col items-start justify-start gap-4 mb-6">
        <h2 className="text-title text-[22px]">
          {tab === "search" ? "도서 검색" : "내가 찜한 책"}
        </h2>
      </div>
      {tab === "search" && (
        <SearchForm
          setSearchValue={setSearchValue}
          setIsDetail={setIsDetail}
          isDetail={isDetail}
          setTargetValue={setTargetValue}
          searchValue={searchValue}
          targetValue={targetValue}
        />
      )}
      <BookList
        key={tab}
        bookList={bookList}
        meta={meta}
        searchValue={searchValue}
      />
      <div ref={observerRef} className="h-10" />
    </section>
  );
}

export default Container;
