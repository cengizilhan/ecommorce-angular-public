import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CategoryService } from '../../features/categories/services/category.service';
import { CartService } from '../../features/cart/services/cart.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Category } from '../../models/category.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
    imports: [
    CommonModule,     RouterLink,
    RouterLinkActive,
    TranslateModule
  ],
  styleUrls: ['./header.component.scss'] 
})
export class HeaderComponent implements OnInit {

  categories: Category[] = [];
  currentLang = 'en';

  constructor(
    private categoryService: CategoryService,
    public cartService: CartService,
    public authService: AuthService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.setDefaultLang('en');
    
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('app_lang');
      if (savedLang) {
        this.currentLang = savedLang;
        this.translate.use(savedLang);
      } else {
        this.translate.use('en');
      }
    }
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('app_lang', lang);
    }
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}
