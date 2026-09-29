import { Component, OnInit, signal, computed, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SafeCustomHtmlPipe } from '../../shared/pipes/safe-custom-html.pipe';
import { NoContentComponent } from '../../shared/components/no-content/no-content.component';
import { ProductService } from '../../services/product.service';
import { ShopInfoService, ShopInfo } from '../../services/shop-info.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ScrollRevealDirective, SafeCustomHtmlPipe, NoContentComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private shopInfoService = inject(ShopInfoService);
  private categoryService = inject(CategoryService);

  readonly featuredProducts = signal<Product[]>([]);
  readonly shopInfo = signal<ShopInfo | null>(null);
  readonly categories = signal<Category[]>([]);
  readonly scrollY = signal(0);

  /* Loading / error states — every dynamic section degrades gracefully. */
  readonly shopInfoLoading = signal(true);
  readonly shopInfoError = signal(false);
  readonly categoriesLoading = signal(true);
  readonly categoriesError = signal(false);
  readonly featuredLoading = signal(true);
  readonly featuredError = signal(false);

  readonly heroParallax = computed(() => `translateY(${this.scrollY() * 0.35}px)`);

  /* Stats come exclusively from the API — nothing is rendered if absent. */
  readonly stats = computed(() => this.shopInfo()?.statsItems ?? []);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollY.set(window.scrollY);
  }

  ngOnInit(): void {
    this.loadShopInfo();
    this.loadCategories();
    this.loadFeatured();
  }

  loadShopInfo(): void {
    this.shopInfoLoading.set(true);
    this.shopInfoError.set(false);
    this.shopInfoService.getShopInfo().subscribe({
      next: (info) => {
        this.shopInfo.set(info);
        this.shopInfoLoading.set(false);
      },
      error: () => {
        this.shopInfoLoading.set(false);
        this.shopInfoError.set(true);
      }
    });
  }

  retryShopInfo(): void {
    this.loadShopInfo();
  }

  loadCategories(): void {
    this.categoriesLoading.set(true);
    this.categoriesError.set(false);
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.categoriesLoading.set(false);
      },
      error: () => {
        this.categoriesLoading.set(false);
        this.categoriesError.set(true);
      }
    });
  }

  retryCategories(): void {
    this.loadCategories();
  }

  loadFeatured(): void {
    this.featuredLoading.set(true);
    this.featuredError.set(false);
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.featuredLoading.set(false);
      },
      error: () => {
        this.featuredLoading.set(false);
        this.featuredError.set(true);
      }
    });
  }

  retryFeatured(): void {
    this.loadFeatured();
  }

  /* Images come only from the API; the local brand asset is the sole
   * placeholder when a category has no cover image configured. */
  getCatImage(cat: Category): string {
    return cat.coverImage || cat.image || 'images/carats-bg.png';
  }
}
