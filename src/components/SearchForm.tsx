import { useMemo, useRef, useState } from "react";
import { useHistory } from "../hooks/useHooks";

interface PropsData {
  searchValue: string;
  isDetail: boolean;
  targetValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setIsDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setTargetValue: React.Dispatch<React.SetStateAction<string>>;
}

function SearchForm({
  searchValue,
  isDetail,
  targetValue,
  setSearchValue,
  setIsDetail,
  setTargetValue,
}: PropsData) {
  const { history, setHistory, deleteHistory } = useHistory();
  const [search, setSearch] = useState<string>(isDetail ? "" : searchValue);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isTarget, setIsTarget] = useState<boolean>(false);
  const [detailSearch, setDetailSearch] = useState<string>(
    isDetail ? searchValue : ""
  );
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [target, setTarget] = useState<string>(
    isDetail ? targetValue : "title"
  );

  const searchRef = useRef<HTMLInputElement>(null);

  const filterHistory: string[] = useMemo(() => {
    if (search.trim() === "") return history;

    const searchLower = search.toLowerCase();
    return history.filter((item: string) => {
      const itemLower = item.toLowerCase();
      return itemLower !== searchLower && itemLower.includes(searchLower);
    });
  }, [search, history]);

  const filterTarget = useMemo(() => {
    const targets = ["title", "person", "publisher"];

    return targets.filter((item: string) => item != target);
  }, [target]);

  const handlerHistoryDelete = (index: number) => {
    deleteHistory(index);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const showHistory = isFocus && filterHistory.length > 0;

  const onSubmit = (str: string) => {
    setIsDetail(false);
    setSearchValue(str);
    setIsFocus(false);
    setTarget("title");
    setDetailSearch("");
    if (str) {
      setHistory(str);
    }
  };

  const onDetailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDetail(true);
    setSearchValue(detailSearch);
    setIsDetailOpen(false);
    setTargetValue(target);
    setSearch("");
    if (detailSearch) {
      setHistory(detailSearch);
    }
  };

  const targetName = (target: string) => {
    switch (target) {
      case "publisher":
        return "출판사";
      case "person":
        return "저자명";
      default:
        return "제목";
    }
  };

  return (
    <div className="flex relative justify-start gap-4 items-center mb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(search);
        }}
        className={`${
          showHistory ? "rounded-t-[24px]" : "rounded-[100px]"
        } w-[480px] relative z-10 p-[10px] bg-paletteLG flex justify-start items-center gap-3`}
      >
        <img src="search_icon.png" alt="searchIcon" />
        <input
          ref={searchRef}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocus(false);
            }, 200);
          }}
          className="bg-transparent w-[90%] focus:outline-none placeholder:text-subTitle"
          type="text"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {showHistory && (
          <div className="absolute py-7 px-4 z-1 rounded-b-[24px] w-full top-10 left-0 bg-paletteLG flex flex-col gap-6">
            {filterHistory.map((val, index) => {
              return (
                <div
                  className="flex justify-between items-center pl-9"
                  key={`${val}-${index}`}
                >
                  <span
                    onClick={() => {
                      setSearch(val);
                      onSubmit(val);
                    }}
                    className="text-subTitle cursor-pointer"
                  >
                    {val}
                  </span>
                  <img
                    className="cursor-pointer"
                    src="close.png"
                    alt="close"
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      handlerHistoryDelete(index);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </form>
      <div className="relative">
        <button
          type="button"
          className="py-[5px] px-[10px] text-subTitle border border-subTitle rounded-[8px] bg-transparent text-sm"
          onClick={() => setIsDetailOpen(true)}
        >
          상세검색
        </button>
        {isDetailOpen && (
          <div
            className="absolute top-[calc(100%+15px)] shadow-[0px_4px_14px_6px_#97979726]
 w-[360px] -left-[143px]  bg-white px-6 py-9 z-20"
          >
            <img
              className="absolute top-2 right-2 cursor-pointer"
              src="close-detail.png"
              alt="close-detail"
              onClick={() => setIsDetailOpen(false)}
            />
            <form className="flex flex-col gap-4" onSubmit={onDetailSubmit}>
              <div className="flex justify-center items-center gap-1">
                <div
                  onClick={() => setIsTarget(!isTarget)}
                  className="relative w-[100px] px-2 py-[6px] border-b border-[#d2d6da] flex justify-between items-center cursor-pointer"
                >
                  <span className="text-sm font-bold">
                    {targetName(target)}
                  </span>
                  <img src="arrow-detail.png" alt="arrow-detail" />
                  {isTarget && (
                    <div className="absolute top-[calc(100%+6px)] left-0  w-full bg-white shadow-[0px_0px_4px_0px_#00000040]">
                      {filterTarget.map((val, index) => {
                        return (
                          <p
                            onClick={() => setTarget(val)}
                            className="text-sm py-[5px] px-2 text-subTitle"
                            key={`${val}-${index}`}
                          >
                            {targetName(val)}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="py-1 px-[10px] w-[208px] border-b border-palettePrimary">
                  <input
                    className="placeholder:text-subTitle text-sm  focus:outline-none"
                    type="text"
                    placeholder="검색어 입력"
                    value={detailSearch}
                    onChange={(e) => setDetailSearch(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-[8px] bg-palettePrimary text-white text-sm py-[7px] text-center"
              >
                검색하기
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
export default SearchForm;
