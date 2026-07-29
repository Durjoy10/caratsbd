import { Component, OnInit, signal, computed, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SafeCustomHtmlPipe } from '../../shared/pipes/safe-custom-html.pipe';
import { ProductService } from '../../services/product.service';
import { ShopInfoService, ShopInfo } from '../../services/shop-info.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ScrollRevealDirective, SafeCustomHtmlPipe],
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

  readonly heroParallax = computed(() => `translateY(${this.scrollY() * 0.35}px)`);

  readonly stats = computed(() => {
    const info = this.shopInfo();
    if (info?.statsItems && info.statsItems.length > 0) {
      return info.statsItems;
    }
    return [
      { value: '500+', label: 'Unique Pieces' },
      { value: '12+', label: 'Years of Craft' },
      { value: '5K+', label: 'Happy Clients' },
      { value: '18K', label: 'Pure Gold' },
    ];
  });

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollY.set(window.scrollY);
  }

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts.set(products);
    });

    this.shopInfoService.getShopInfo().subscribe({
      next: (info) => this.shopInfo.set(info),
      error: (err) => console.error('Failed to fetch shop info/banners:', err)
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Failed to fetch dynamic categories:', err)
    });
  }

  getCatImage(cat: Category): string {
    if (cat.coverImage) return cat.coverImage;
    if (cat.image) return cat.image;
    const map: Record<string, string> = {
      rings:     'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
      necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
      bracelets: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
      chains:    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
      earrings:  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    };
    return map[cat.slug.toLowerCase()] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80';
  }
}
