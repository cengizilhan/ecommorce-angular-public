import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductFilter, INITIAL_FILTER } from '../../models/filter-state.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private jsonUrl = 'assets/data/products.json';

  private sourceProducts = signal<Product[]>([]);
  
  filterState = signal<ProductFilter>(INITIAL_FILTER);

  filteredData = computed(() => {
    let data = this.sourceProducts();
    const filter = this.filterState();

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      data = data.filter((p: Product) => 
        (p.title.en && p.title.en.toLowerCase().includes(searchLower)) || 
        (p.title.tr && p.title.tr.toLowerCase().includes(searchLower)) || 
        (p.title.es && p.title.es.toLowerCase().includes(searchLower)) || 
        p.description.en.toLowerCase().includes(searchLower) ||
        p.description.tr.toLowerCase().includes(searchLower) ||
        p.description.es.toLowerCase().includes(searchLower)
      );
    }

    if (filter.categoryIds && filter.categoryIds.length > 0) {
      data = data.filter((p: Product) => filter.categoryIds.includes(p.categoryId));
    }

    if (filter.sort) {
      data = [...data].sort((a: Product, b: Product) => {
        switch (filter.sort) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'name-asc': return (a.title.en || '').localeCompare(b.title.en || '');
          case 'name-desc': return (b.title.en || '').localeCompare(a.title.en || '');
          default: return 0;
        }
      });
    }

    return data;
  });

  paginatedProducts = computed(() => {
    const data = this.filteredData();
    const filter = this.filterState();
    const start = (filter.page - 1) * filter.pageSize;
    return data.slice(start, start + filter.pageSize);
  });

  totalItems = computed(() => this.filteredData().length);
  pageCount = computed(() => Math.ceil(this.totalItems() / this.filterState().pageSize));

  constructor(private http: HttpClient) { 
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>(this.jsonUrl).subscribe(data => {
      this.sourceProducts.set(data);
    });
  }

  updateFilter(changes: Partial<ProductFilter>) {
    this.filterState.update(current => {
      const isFilterChange = 
        changes.search !== undefined || 
        changes.sort !== undefined ||
        changes.categoryIds !== undefined;

      const newPage = isFilterChange && !changes.page 
        ? 1 
        : (changes.page ?? current.page);

      return {
        ...current,
        ...changes,
        page: newPage
      };
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.jsonUrl);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
