export interface ProductFilter {
  search: string;
  categoryIds: number[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page: number;
  pageSize: number;
}

export const INITIAL_FILTER: ProductFilter = {
  search: '',
  categoryIds: [],
  page: 1,
  pageSize: 9,
  sort: 'name-asc'
};
