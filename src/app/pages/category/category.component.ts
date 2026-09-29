import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SafeCustomHtmlPipe } from '../../shared/pipes/safe-custom-html.pipe';
import { NoContentComponent } from '../../shared/components/no-content/no-content.component';
import { normalizeSlug } from '../../shared/utils/slug.utils';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ScrollRevealDirective, SafeCustomHtmlPipe, NoContentComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  readonly slug = signal('');
  readonly category = signal<Category | undefined>(undefined);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly retrying = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug.set(normalizeSlug(params['slug']));
      this.load();
    });
  }

  load(): void {
    const slug = this.slug();
    this.loading.set(true);
    this.error.set(false);
    this.products.set([]);
    this.category.set(undefined);

    this.categoryService.getCategoryBySlug(slug).subscribe({
      next: cat => this.category.set(cat),
      error: () => this.error.set(true)
    });

    this.productService.getProductsByCategory(slug).subscribe({
      next: prods => {
        this.products.set(prods);
        this.loading.set(false);
        this.retrying.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.retrying.set(false);
        this.error.set(true);
      }
    });
  }

  retry(): void {
    this.retrying.set(true);
    this.load();
  }
}
