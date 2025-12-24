import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../../products/models/product.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  
  cartItems = signal<CartItem[]>([]);

  totalItems = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.loadCart();

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
      }
    });
  }

  private loadCart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.cartItems.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart items', e);
        this.cartItems.set([]);
      }
    }
  }

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...items, { product, quantity: 1 }];
      }
    });

    const productTitle = (product.title as any)[this.translate.currentLang] || product.title.en;
    
    this.translate.get(['NOTIFICATIONS.CART_SUCCESS_TITLE', 'NOTIFICATIONS.CART_SUCCESS_MESSAGE'], { productName: productTitle })
      .subscribe(translations => {
        this.notificationService.success(
          translations['NOTIFICATIONS.CART_SUCCESS_TITLE'],
          translations['NOTIFICATIONS.CART_SUCCESS_MESSAGE']
        );
      });
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
