import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShopInfoService, ShopInfo } from '../../../services/shop-info.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  private shopInfoService = inject(ShopInfoService);
  private categoryService = inject(CategoryService);

  readonly year = new Date().getFullYear();
  readonly shopInfo = signal<ShopInfo | null>(null);
  readonly categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.shopInfoService.getShopInfo().subscribe({
      next: (info) => this.shopInfo.set(info),
      error: () => {}
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {}
    });
  }
}
