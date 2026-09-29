import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { normalizeSlug } from '../../shared/utils/slug.utils';
import { NoContentComponent } from '../../shared/components/no-content/no-content.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, ScrollRevealDirective, NoContentComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  readonly allProducts = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly activeFilter = signal('all');
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly retrying = signal(false);

  readonly filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const list = this.allProducts();
    return filter === 'all'
      ? list
      : list.filter(p => normalizeSlug(p.categorySlug || p.category) === filter);
  });

  /* Filter chips are derived only from the API categories — no hardcoded list. */
  readonly filterOptions = computed(() => [
    { label: 'All', value: 'all' },
    ...this.categories().map(c => ({ label: c.name, value: normalizeSlug(c.slug) }))
  ]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.productService.getAllProducts().subscribe({
      next: products => {
        this.allProducts.set(products);
        this.loading.set(false);
        this.retrying.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.retrying.set(false);
        this.error.set(true);
      }
    });

    this.categoryService.getCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: () => this.categories.set([])
    });
  }

  retry(): void {
    this.retrying.set(true);
    this.load();
  }

  setFilter(value: string): void {
    this.activeFilter.set(value);
  }
}
