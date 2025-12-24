import { Component , Input,  } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../../cart/services/cart.service';
  
  
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private cartService: CartService,
    public translate: TranslateService
  ) {}

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(this.product);
  }

  get description(): string {
    return (this.product.description as any)[this.translate.currentLang] || this.product.description.en;
  }

  get title(): string {
    return (this.product.title as any)[this.translate.currentLang] || this.product.title.en;
  }
}
