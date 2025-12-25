export interface BooksData {
  authors: string[];
  contents: string;
  datetime: Date;
  isbn: string;
  price: number;
  sale_price: number;
  publisher: string;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
}

export interface MetaData {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
}
