import { Component } from '@angular/core';
import { ProductCardListComponent } from '../../features/products/components/product-card-list/product-card-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardListComponent, TranslateModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
