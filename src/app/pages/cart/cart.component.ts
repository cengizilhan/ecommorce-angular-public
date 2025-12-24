import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../features/cart/services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../features/products/models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  constructor(
    public cartService: CartService,
    private translate: TranslateService
  ) {}

  getTitle(product: Product): string {
    return (product.title as any)[this.translate.currentLang] || product.title.en;
  }

  updateQuantity(productId: number, event: Event) {
    const quantity = Number((event.target as HTMLInputElement).value);
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
