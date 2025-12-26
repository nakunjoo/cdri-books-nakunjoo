import { useTab } from "../contexts/TabContext";

function Header() {
  const { tab, setTab } = useTab();
  return (
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
  );
}
export default Header;
