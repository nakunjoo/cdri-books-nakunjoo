## 프로젝트 개요

kakao API를 사용한 도서 검색 기능입니다.

### 주요기능

- 전체 검색, 상세 검색 구분, 검색 기록 저장
- 검색 결과 무한 스크롤 구현
- 찜하기 기능 구현

## 실행 방법 및 환경 설정

1. 저장소 클론
   git clone https://github.com/nakunjoo/cdri-books-nakunjoo
   cd cdri-books-nakunjoo

2. 의존성 설치
   npm install

3. 환경 변수 설정
   메일 첨부파일 .env파일을 프로젝트 루트에 옮기기

4. 개발 서버 실행
   npm run dev

5. 빌드
   npm run build

## 폴더 구조 및 주요 코드 설명

### src/api - API호출 및 localStorage 관리 로직

- /search.ts (도서 검색 API)

```javascript
let url = `https://dapi.kakao.com/v3/search/book?query=${search}&page=${page}`;

if (detail) {
  url += `&target=${target}`;
}
```

전체 검색시 query와 page값만 보내고 상세 검색시 target값을 추가하여 보냄

- /history.ts (검색 기록 관리)
  localStorage를 사용하여 검색어 저장 및 조회
- /like.ts (찜하기 관리)
  localStorage를 사용하여 찜 도서 목록 페이지 네이션 조회 및 isba,title,datetime를 비교하여 토글

### src/components - UI 컴포넌트

- /Header.tsx (헤더)
  도서 검색, 내가 찜한 책 탭 상태 변경
- /Container.tsx (메인 컨테이너)

```javascript
  const activeQuery = tab === "search" ? searchQuery : likeBooks;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = activeQuery;
  ...
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
```

tab상태에 따른 query 호출, 무한 스크롤 기능 구현

- /SearchForm.tsx (검색 폼)
  도서 검색일 경우만 보이고, 전체 검색, 상세 검색 form 구분, 검색 기록 필터링
- /BookList.tsx (도서 목록)
  tab상태에 따른 문구 변경 및 selectIndex관리
- /Book.tsx (도서 카드)
  찜 토글 관리, 상세 보기 시 아코디언

### src/contexts - Context API

- /TabContext.tsx
  tab 상태 관리

### src/hooks - 커스텀 훅

- /useHooks.ts
  react-query를 사용하여 커스텀 훅 등록

```javascript
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
```

찜하기 시 전체 찜 목록과 페이지 네이션 찜 목록을 다른 queryKey로 구분하여 isLikes로 찜된 도서 판별

### src/types - 타입 정의

- /Books.ts
  kakao API에서 받아온 도서 데이터 및 meta데이터의 타입 정의

## 라이브러리 선택 이유

### Vite (빌드도구)

- 빠른 개발 환경
- 프로젝트 생성시 초기 설정이 간단하고, React에서 공식 지원

### tailwindCss

- 빠르고 간편한 스타일링
- tailwind.config.js에서 커스텀 컬러 관리

## 강조 하고 싶은 기능

### 탭 변경시 사라지지 않는 검색 결과 및 기록

- 하나의 컨테이너에서 tab상태로 query를 관리하여 탭 변경시에도 데이터가 초기화 되지않고 캐시로 남아있도록 구현하였습니다.

### 무한스크롤

- react-query의 useInfiniteQuery와 IntersectionObserver을 사용하여

```javascript
<div ref={observerRef} className="h-10" />
```

해당 영역이 보일때 다음 페이지에 해당하는 목록을 불러오도록 설정하였습니다.

### 검색 기록 자동 완성

- 입력값을 기반으로 검색기록을 실시간 필터링 하여 검색 기록 자동 완성 기능을 구현하였습니다.
