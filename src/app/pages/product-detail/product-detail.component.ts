import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../features/products/services/products/products.service';
import { Product } from '../../features/products/models/product.model';
import { Observable, switchMap } from 'rxjs';
import { CartService } from '../../features/cart/services/cart.service';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    public translate: TranslateService
  ) {}

  getDescription(product: Product): string {
    return (product.description as any)[this.translate.currentLang] || product.description.en;
  }

  getTitle(product: Product): string {
    return (product.title as any)[this.translate.currentLang] || product.title.en;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.productsService.getProduct(id);
      })
    );
  }
}
