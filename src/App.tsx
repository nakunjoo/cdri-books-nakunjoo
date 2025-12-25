import { useState } from "react";
import SearchContainer from "./components/SearchContainer";
import LikeContainer from "./components/LikeContainer";

function App() {
  const [tab, setTab] = useState<string>("search");

  return (
    <main className="w-full">
      <header className="w-full max-w-[1600px] mx-auto mb-[104px] py-6 flex justify-start items-center">
        <h1 className="text-2xl font-bold">CERTICOS BOOKS</h1>
        <ul className="ml-[400px] flex justify-center items-center gap-14">
          <li
            className={`${
              tab === "search" ? "border-b" : "hover:border-b"
            } text-xl border-palettePrimary cursor-pointer`}
            onClick={() => setTab("search")}
          >
            도서 검색
          </li>
          <li
            className={`${
              tab === "like" ? "border-b" : "hover:border-b"
            } text-xl border-palettePrimary cursor-pointer`}
            onClick={() => setTab("like")}
          >
            내가 찜한 책
          </li>
        </ul>
      </header>
      <div className="w-full max-w-[960px] mx-auto">
        {tab === "search" ? <SearchContainer /> : <LikeContainer />}
      </div>
    </main>
  );
}

export default App;
