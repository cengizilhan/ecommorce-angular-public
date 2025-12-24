import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main.layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout, 
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
      { path: 'category', loadComponent: () => import('./pages/category/category.component').then(c => c.CategoryComponent) },
      { path: 'products', loadComponent: () => import('./pages/products/products.component').then(c => c.ProductsComponent) },
      { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(c => c.ProductDetailComponent) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(c => c.CartComponent) },
      { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent) }
    ]
  }
];

