import { useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "../hooks/useHooks";
import BookList from "./BookList";
import { useQueryClient } from "@tanstack/react-query";

function SearchContainer() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [target, setTarget] = useState<string>("title");

  const observerRef = useRef<HTMLDivElement>(null);

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearch({
      search: searchValue,
      detail: isDetail,
      target,
    });

  console.log("data:", data);

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    queryClient.removeQueries({
      queryKey: ["books", searchValue],
    });
    console.log("search:", search);
    setSearchValue(search);
  };

  useEffect(() => {
    if (searchValue) {
      refetch();
    }
  }, [searchValue, refetch]);

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
        <h2 className="text-title text-[22px]">도서 검색</h2>
        <div className="flex justify-start gap-4 items-center">
          <form
            onSubmit={onSubmit}
            className="w-[480px] p-[10px] bg-paletteLG rounded-[100px] flex justify-start items-center gap-3"
          >
            <img src="search_icon.png" alt="searchIcon" />
            <input
              className="bg-transparent w-[90%] focus:outline-none placeholder:text-subTitle"
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </form>
          <div>
            <button
              type="button"
              className="py-[5px] px-[10px] text-subTitle border border-subTitle rounded-[8px] bg-transparent text-sm"
            >
              상세검색
            </button>
          </div>
        </div>
      </div>
      <BookList tab={"search"} bookList={bookList} meta={meta} />
      <div ref={observerRef} className="h-10" />
    </section>
  );
}

export default SearchContainer;
