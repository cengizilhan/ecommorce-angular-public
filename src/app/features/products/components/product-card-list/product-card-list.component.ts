import { Component, Input, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductsService } from '../../services/products/products.service';

@Component({
  selector: 'app-product-card-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-card-list.component.html',
  styleUrl: './product-card-list.component.scss',
})
export class ProductCardListComponent implements OnInit {
  @Input() limit?: number; 
  products: any = signal<Product[]>([]); 
  loading = signal(false);

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    if (this.limit) {
      this.loading.set(true);
      this.productsService.getProducts().subscribe({
        next: (data) => {
          (this.products as any).set(data.slice(0, this.limit));
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load products', err);
          this.loading.set(false);
        },
      });
    } else {
      this.products = this.productsService.paginatedProducts;
    }
  }
}
