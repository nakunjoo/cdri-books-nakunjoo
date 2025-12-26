import type { BooksData, MetaData } from "../types/Books";
import { useState } from "react";
import Book from "./Book";
import { useTab } from "../contexts/TabContext";

interface PropsData {
  bookList: BooksData[];
  meta: MetaData;
  searchValue?: string;
}

function BookList({ bookList, meta, searchValue }: PropsData) {
  const { tab } = useTab();
  const [selectIndex, setSelectIndex] = useState<number | null>(null);
  const [prevSearch, setPrevSearch] = useState(searchValue);

  if (prevSearch !== searchValue) {
    setPrevSearch(searchValue);
    setSelectIndex(null);
  }

  return (
    <div className="pb-[100px]">
      <div className="flex justify-start items-center gap-4 mb-6">
        <p>{tab === "search" ? "도서 검색 결과" : "찜한 책"}</p>
        <p>
          총{" "}
          <span className="text-palettePrimary">
            {meta.pageable_count.toLocaleString() || 0}
          </span>
          건
        </p>
      </div>
      {bookList.length > 0 ? (
        <div>
          {bookList.map((book, index) => {
            const detail = selectIndex === index;
            return (
              <Book
                key={book.isbn + `${index}`}
                book={book}
                detail={detail}
                index={index}
                setSelectIndex={setSelectIndex}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full pt-[120px] flex flex-col justify-center items-center gap-6">
          <img src="icon_book.png" alt="icon_book" />
          <p className="text-secondary">
            {tab === "search"
              ? "검색된 결과가 없습니다."
              : "찜한 책이 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
}

export default BookList;
