import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, ScrollRevealDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  readonly allProducts = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly activeFilter = signal('all');

  readonly filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const list = this.allProducts();
    return filter === 'all'
      ? list
      : list.filter(p => (p.categorySlug || p.category.toLowerCase()).replace(/[^a-z0-9]+/g, '-') === filter);
  });

  readonly filterOptions = computed(() => {
    const cats = this.categories();
    if (cats.length > 0) {
      return [
        { label: 'All', value: 'all' },
        ...cats.map(c => ({ label: c.name, value: c.slug.toLowerCase() }))
      ];
    }
    return [
      { label: 'All', value: 'all' },
      { label: 'Rings', value: 'rings' },
      { label: 'Necklaces', value: 'necklaces' },
      { label: 'Bracelets', value: 'bracelets' },
      { label: 'Chains', value: 'chains' },
      { label: 'Earrings', value: 'earrings' }
    ];
  });

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts.set(products);
    });
    this.categoryService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  setFilter(value: string): void {
    this.activeFilter.set(value);
  }
}
