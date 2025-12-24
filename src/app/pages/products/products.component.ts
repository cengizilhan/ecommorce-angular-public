import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ProductCardListComponent } from '../../features/products/components/product-card-list/product-card-list.component';
import { ProductFilterComponent } from '../../features/products/components/product-filter/product-filter.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ProductsService } from '../../features/products/services/products/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardListComponent, CommonModule, ProductFilterComponent, PaginationComponent, TranslateModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  
  constructor(
    public productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
       const filter: any = {};
       if (params['search']) filter.search = params['search'];
       if (params['sort']) filter.sort = params['sort'];
       if (params['page']) filter.page = +params['page'];
       
       if (params['categoryIds']) {
         const ids = Array.isArray(params['categoryIds']) 
           ? params['categoryIds'] 
           : [params['categoryIds']];
         filter.categoryIds = ids.map((id: string) => +id);
       }
       
       if (Object.keys(filter).length > 0) {
         this.productsService.updateFilter(filter);
       }
    });

    effect(() => {
        const state = this.productsService.filterState();
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { 
                search: state.search || null, 
                sort: state.sort || null, 
                page: state.page > 1 ? state.page : null,
                categoryIds: state.categoryIds?.length ? state.categoryIds : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    });
  }

  onPageChange(page: number) {
    this.productsService.updateFilter({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
