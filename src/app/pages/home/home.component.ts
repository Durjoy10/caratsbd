import { Component, OnInit, signal, computed, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { CATEGORIES } from '../../enum/category.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ScrollRevealDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  readonly featuredProducts = signal<Product[]>([]);
  readonly categories = CATEGORIES;
  readonly scrollY = signal(0);

  readonly heroParallax = computed(() => `translateY(${this.scrollY() * 0.35}px)`);

  readonly stats = [
    { value: '500+', label: 'Unique Pieces' },
    { value: '12+', label: 'Years of Craft' },
    { value: '5K+', label: 'Happy Clients' },
    { value: '18K', label: 'Pure Gold' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollY.set(window.scrollY);
  }

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts.set(products);
    });
  }

  getCatImage(slug: string): string {
    const map: Record<string, string> = {
      rings:     '1605100804763-247f67b3557e',
      necklaces: '1599643478518-a784e5dc4c8f',
      bracelets: '1611591437281-460bfbe1220a',
      chains:    '1515562141207-7a88fb7ce338',
      earrings:  '1599643478518-a784e5dc4c8f',
    };
    return map[slug] || '1515562141207-7a88fb7ce338';
  }
}
