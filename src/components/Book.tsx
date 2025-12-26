import type { BooksData } from "../types/Books";
import { useLike } from "../hooks/useHooks";
import { useTab } from "../contexts/TabContext";

interface PropsData {
  book: BooksData;
  detail: boolean;
  index: number;
  setSelectIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
function Book({ book, detail, index, setSelectIndex }: PropsData) {
  const { tab } = useTab();
  const { isLikes, toggleLike } = useLike();
  return (
    <div
      className={`${
        detail
          ? "pt-6 pb-10 px-4 items-start h-[280px]"
          : "p-4 items-center h-[68px]"
      } flex justify-between box-content border-b border-paletteGray transition-all overflow-hidden`}
    >
      <div
        className={`${
          detail ? "ml-8 items-start" : "ml-9 items-center"
        } flex justify-start gap-4 h-full`}
      >
        <div
          className={`${
            detail ? "w-[210px]" : "w-[48px]"
          } relative box-content transition-all h-full`}
        >
          <img
            src={book.thumbnail}
            alt="book_thumbnail"
            className="w-full h-full"
          />
          <img
            onClick={() => {
              if (tab === "like" && detail) {
                setSelectIndex(null);
              }
              toggleLike(book);
            }}
            className={`${
              detail ? "w-6 h-6 top-2 right-2" : "w-4 h-4 top-0 right-0"
            } absolute cursor-pointer`}
            src={`${isLikes(book) ? "like-active.png" : "like.png"}`}
            alt="like"
          />
        </div>
        <div
          className={`${
            detail ? "mt-3 max-w-[360px]" : ""
          } ml-8 flex flex-col justify-start items-start`}
        >
          <div className={`flex items-center justify-start gap-4`}>
            <p
              className={`${
                detail ? "" : "max-w-[260px] truncate"
              } text-lg font-bold`}
            >
              {book.title}
            </p>
            <div className="flex-col flex gap-1">
              {book.authors.map((authhor, i) => {
                return (
                  <div
                    key={`${authhor}-${i}`}
                    className="text-subTitle text-sm text-nowrap"
                  >
                    {authhor}
                  </div>
                );
              })}
            </div>
          </div>
          {detail && (
            <div className="mt-4 flex flex-col items-start justify-start gap-3">
              <h3 className="text-sm font-bold">책 소개</h3>
              <p className="whitespace-pre-line text-[10px]">{book.contents}</p>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${
          detail
            ? "flex-col items-end justify-between h-full"
            : "justify-end items-center"
        } flex gap-2`}
      >
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
        {detail && (
          <div className="flex flex-col gap-7">
            <div className="inline-grid grid-cols-[auto_auto] gap-x-2 gap-y-1 items-center">
              <span className="text-[10px] text-subTitle justify-self-end">
                원가
              </span>
              <span
                className={`${
                  book.sale_price > 0 ? "line-through font-light" : "font-bold"
                } text-lg text-right whitespace-nowrap`}
              >
                {book.price.toLocaleString()}원
              </span>
              {book.sale_price > 0 && (
                <>
                  <span className="text-[10px] text-subTitle justify-self-end">
                    할인가
                  </span>
                  <span className="text-lg font-bold text-right whitespace-nowrap">
                    {book.sale_price.toLocaleString()}원
                  </span>
                </>
              )}
            </div>
            <a
              href={book.url}
              target="_blank"
              className="bg-palettePrimary text-white py-3 px-5 rounded-[8px] w-[240px] h-[48px] text-center"
            >
              구매하기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Book;
