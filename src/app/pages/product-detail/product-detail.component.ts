import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SafeCustomHtmlPipe } from '../../shared/pipes/safe-custom-html.pipe';
import { InquiryModalComponent } from '../../shared/components/inquiry-modal/inquiry-modal.component';
import { MetaPixelService } from '../../core/meta-pixel.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, ProductCardComponent, ScrollRevealDirective, SafeCustomHtmlPipe, InquiryModalComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private metaPixelService = inject(MetaPixelService);
  private http = inject(HttpClient);

  readonly product = signal<Product | undefined>(undefined);
  readonly relatedProducts = signal<Product[]>([]);
  readonly activeImage = signal('');
  readonly activeImageIndex = signal(0);
  readonly showInquiryModal = signal(false);

  /* Slideshow Timer (10 Seconds) */
  readonly isHovered = signal(false);
  private slideInterval: any = null;

  /* Magnifier Zoom Effect */
  readonly isZooming = signal(false);
  readonly zoomX = signal(50);
  readonly zoomY = signal(50);
  readonly lensX = signal(0);
  readonly lensY = signal(0);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
        this.productService.getProductById(id).subscribe(product => {
          this.product.set(product);
          if (product) {
            this.activeImageIndex.set(0);
            this.activeImage.set(product.images[0] || '');
            const catSlug = product.categorySlug || product.category.toLowerCase();
            this.productService.getProductsByCategory(catSlug).subscribe(related => {
              this.relatedProducts.set(related.filter(p => p._id !== product._id).slice(0, 4));
            });
            this.startSlideshow();
            const eventId = this.metaPixelService.trackViewContent(product);
            // Fire-and-forget — do not await, do not block UI
            this.http.post(
              `${environment.apiBaseLink}${environment.ftpPrefix}/products/${product._id}/view`,
              { eventId },
              { headers: { 'Content-Type': 'application/json' } }
            ).subscribe({ error: () => {} }); // swallow errors silently
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.stopSlideshow();
    this.slideInterval = setInterval(() => {
      if (!this.isHovered()) {
        this.nextImage();
      }
    }, 10000); // 10 seconds
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextImage(): void {
    const prod = this.product();
    if (!prod || !prod.images || prod.images.length <= 1) return;
    const nextIdx = (this.activeImageIndex() + 1) % prod.images.length;
    this.activeImageIndex.set(nextIdx);
    this.activeImage.set(prod.images[nextIdx]);
  }

  setActiveImage(img: string, index: number): void {
    this.activeImageIndex.set(index);
    this.activeImage.set(img);
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
    this.isZooming.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    this.isZooming.set(false);
  }

  onMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    this.zoomX.set(percentX);
    this.zoomY.set(percentY);
    this.lensX.set(x);
    this.lensY.set(y);
  }

  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/products']);
  }
}
