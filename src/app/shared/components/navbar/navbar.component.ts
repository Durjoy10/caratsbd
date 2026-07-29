import { Component, HostListener, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { ShopInfoService, ShopInfo } from '../../../services/shop-info.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private themeService = inject(ThemeService);
  private shopInfoService = inject(ShopInfoService);
  private categoryService = inject(CategoryService);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly categories = signal<Category[]>([]);
  readonly isDark = this.themeService.isDark;
  readonly shopInfo = signal<ShopInfo | null>(null);

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

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
