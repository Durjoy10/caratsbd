import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SafeCustomHtmlPipe } from '../../shared/pipes/safe-custom-html.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, ProductCardComponent, ScrollRevealDirective, SafeCustomHtmlPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly product = signal<Product | undefined>(undefined);
  readonly relatedProducts = signal<Product[]>([]);
  readonly activeImage = signal('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.productService.getProductById(id).subscribe(product => {
        this.product.set(product);
        if (product) {
          this.activeImage.set(product.images[0] || '');
          const catSlug = product.categorySlug || product.category.toLowerCase();
          this.productService.getProductsByCategory(catSlug).subscribe(related => {
            this.relatedProducts.set(related.filter(p => p._id !== product._id).slice(0, 4));
          });
        }
      });
    });
  }

  setActiveImage(img: string): void {
    this.activeImage.set(img);
  }

  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/products']);
  }
}
