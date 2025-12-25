import type { BooksData, MetaData } from "../types/Books";
import { useState } from "react";

interface PropsData {
  tab: string;
  bookList: BooksData[];
  meta: MetaData;
}

function BookList({ tab, bookList, meta }: PropsData) {
  const [selectIndex, setSelectIndex] = useState<number | null>(null);

  return (
    <div className="pb-[100px]">
      <div className="flex justify-start items-center gap-4 mb-6">
        <p>{tab === "search" ? "도서 검색 결과" : "찜한 책"}</p>
        <p>
          총 <span className="text-palettePrimary">{meta.total_count}</span>건
        </p>
      </div>
      {bookList.length > 0 ? (
        <div>
          {bookList.map((book, index) => {
            const detail = selectIndex === index;
            return (
              <div
                key={book.isbn + `${index}`}
                className={`${
                  detail ? "pt-6 pb-10 px-4" : "p-4"
                } flex justify-between items-center border-b border-paletteGray transition-all`}
              >
                <div
                  className={`${
                    detail ? "ml-8" : "ml-9"
                  } flex justify-start items-center gap-4`}
                >
                  <div
                    className={`${
                      detail ? "w-[210px] h-[280px]" : "w-[48px] h-[68px]"
                    } relative transition-all duration-500`}
                  >
                    <img
                      src={book.thumbnail}
                      alt="book_thumbnail"
                      className="w-full h-full"
                    />
                  </div>
                  <p
                    className={`${
                      detail ? "" : "max-w-[300px] truncate"
                    } ml-8 text-lg font-bold`}
                  >
                    {book.title}
                  </p>
                  {book.authors.map((authhor) => {
                    return (
                      <>
                        <span className="text-subTitle text-sm" key={authhor}>
                          {authhor}
                        </span>
                      </>
                    );
                  })}
                </div>
                <div className={`flex justify-end items-center gap-2`}>
                  {!detail && (
                    <>
                      <p className="font-bold text-lg mr-[52px]">
                        {book.sale_price > 0
                          ? book.sale_price.toLocaleString()
                          : book.price.toLocaleString()}
                        원
                      </p>
                      <a
                        href={book.url}
                        target="_blank"
                        className="bg-palettePrimary text-white py-3 px-5 rounded-[8px]"
                      >
                        구매하기
                      </a>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (detail) {
                        setSelectIndex(null);
                      } else {
                        setSelectIndex(index);
                      }
                    }}
                    type="button"
                    className="flex justify-start items-center px-[18px] py-3 gap-1 bg-paletteLG text-secondary"
                  >
                    상세보기 <img src="arrow.png" alt="arrow" />
                  </button>
                </div>
              </div>
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
