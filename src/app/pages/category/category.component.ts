import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SafeCustomHtmlPipe } from '../../shared/pipes/safe-custom-html.pipe';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ScrollRevealDirective, SafeCustomHtmlPipe],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  readonly category = signal<Category | undefined>(undefined);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loading.set(true);
      this.categoryService.getCategoryBySlug(slug).subscribe(cat => {
        this.category.set(cat);
      });
      this.productService.getProductsByCategory(slug).subscribe(prods => {
        this.products.set(prods);
        this.loading.set(false);
      });
    });
  }
}
