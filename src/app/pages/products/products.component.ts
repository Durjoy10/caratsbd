import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
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

  readonly allProducts = signal<Product[]>([]);
  readonly activeFilter = signal('all');

  readonly filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const list = this.allProducts();
    return filter === 'all'
      ? list
      : list.filter(p => (p.categorySlug || p.category.toLowerCase()) === filter);
  });

  readonly filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Rings', value: 'rings' },
    { label: 'Necklaces', value: 'necklaces' },
    { label: 'Bracelets', value: 'bracelets' },
    { label: 'Chains', value: 'chains' },
    { label: 'Earrings', value: 'earrings' }
  ];

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts.set(products);
    });
  }

  setFilter(value: string): void {
    this.activeFilter.set(value);
  }
}
