import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { debounceTime, distinctUntilChanged, startWith, Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../categories/services/category.service';
import { Category } from '../../../../models/category.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="product-filter p-5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 mb-8 sticky top-4 z-30 transition-shadow hover:shadow-md">
      <div class="flex flex-col md:flex-row gap-5 justify-between items-center">
        <!-- Search -->
        <div class="w-full md:w-96 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            [formControl]="searchControl" 
            type="text" 
            placeholder="Search for products..." 
            class="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 outline-none"
          >
        </div>

        <!-- Sort -->
        <div class="w-full md:w-auto flex items-center gap-3">
          <div class="relative">
            <select 
              [formControl]="sortControl" 
              class="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 hover:bg-white border text-gray-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all duration-200 border-gray-200"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <div class="flex flex-wrap gap-3">
          <label 
            *ngFor="let cat of categories" 
            class="group relative flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-white border border-transparent hover:border-blue-100 rounded-lg px-3 py-2 transition-all select-none"
            [class.bg-blue-50]="selectedCategoryIds.includes(cat.ID)"
            [class.border-blue-200]="selectedCategoryIds.includes(cat.ID)"
          >
            <input 
              type="checkbox" 
              [value]="cat.ID" 
              [checked]="selectedCategoryIds.includes(cat.ID)"
              (change)="toggleCategory(cat.ID, $event)"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
            >
            <span class="text-sm text-gray-600 group-hover:text-blue-700 font-medium">{{ cat.CategoryName[translate.currentLang] || cat.CategoryName['en'] }}</span>
          </label>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  sortControl = new FormControl('name-asc');
  private destroy$ = new Subject<void>();

  categories: Category[] = [];
  selectedCategoryIds: number[] = [];

  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService,
    public translate: TranslateService
  ) {
    effect(() => {
      const state = this.productsService.filterState();
      
      if (this.searchControl.value !== state.search) {
        this.searchControl.setValue(state.search, { emitEvent: false });
      }
      
      if (this.sortControl.value !== state.sort) {
        this.sortControl.setValue(state.sort || null, { emitEvent: false });
      }

      this.selectedCategoryIds = state.categoryIds || [];
    });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.productsService.updateFilter({ search: value || '' });
    });

    this.sortControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.productsService.updateFilter({ sort: value || 'name-asc' });
    });
  }

  toggleCategory(categoryId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategoryIds = [...this.selectedCategoryIds, categoryId];
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
    this.productsService.updateFilter({ categoryIds: this.selectedCategoryIds });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
