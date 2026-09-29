import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, shareReplay, retry, defer, throwError, timer } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { normalizeSlug } from '../shared/utils/slug.utils';
import { CategoryService } from './category.service';

/** All consumers subscribe through this single cached request (shareReplay),
 *  so navigation never re-fires the API and slow/mobile connections
 *  (Instagram & Facebook in-app browsers) reuse one shared response. */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private categoryService = inject(CategoryService);
  private apiUrl = `${environment.apiBaseLink}${environment.ftpPrefix}`;

  private productsCache$: Observable<Product[]> | null = null;

  private normalizeProduct(p: any): Product {
    const title = p.name || p.title || 'Untitled Piece';
    const category = p.category || p.categoryName || 'Jewellery';
    // IMPORTANT: normalize slugs (live API stores "rings-" / "earrings-")
    const categorySlug = normalizeSlug(p.categorySlug || category);
    const rawImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : [];

    return {
      _id: p._id || p.id || String(Math.random()),
      catalogNumber: p.catalogNumber || '',
      catalogPage: p.catalogPage,
      bagNo: p.bagNo || '',
      styleCode: p.styleCode || '',
      name: title,
      title: title,
      category: category,
      categoryName: category,
      categorySlug: categorySlug,
      subcategory: p.subcategory || '',
      description: p.description || '',
      images: rawImages,
      baseMetal: p.baseMetal || p.material || '',
      material: p.material || p.baseMetal || '18K Gold',
      grossWeight: p.grossWeight,
      diamondWeight: p.diamondWeight,
      weight: p.grossWeight ? `${p.grossWeight}g` : (p.weight || ''),
      price: p.price,
      priceType: p.priceType,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      showPrice: p.showPrice !== undefined ? Boolean(p.showPrice) : true,
      stockQuantity: p.stockQuantity,
      isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
      featured: p.featured !== undefined ? Boolean(p.featured) : true,
      slug: p.slug || p._id,
      tags: Array.isArray(p.tags) ? p.tags : [],
      createdAt: p.createdAt ? new Date(p.createdAt) : undefined
    };
  }

  /** Retry transient network failures (flaky mobile webviews) with backoff.
   *  Real errors are re-thrown — no fake/static data is ever substituted. */
  private fetchWithRetry<T>(url: string, label: string): Observable<T> {
    return defer(() => this.http.get<any>(url)).pipe(
      retry({
        count: 2,
        // Never retry definitive client errors (404/401/403) — only network
        // glitches (status 0) and server hiccups (5xx), common on mobile webviews.
        delay: (err: HttpErrorResponse, attempt: number) =>
          err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500
            ? throwError(() => err)
            : timer(400 * (attempt + 1))
      }),
      map(res => {
        const payload = res.data || res;
        const items = Array.isArray(payload) ? payload : (payload.data || payload.items || []);
        return items;
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(`API ${label} request failed:`, err);
        // Allow a clean retry next time instead of caching the failure result.
        this.productsCache$ = null;
        return throwError(() => err);
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    // Only one in-flight/shared request for the whole app session.
    if (!this.productsCache$) {
      this.productsCache$ = this.fetchWithRetry<any>(`${this.apiUrl}/products?limit=100`, 'products').pipe(
        map((items: any[]) => items.filter((p: any) => p.isActive !== false).map((p: any) => this.normalizeProduct(p))),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.productsCache$;
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => {
        const featured = products.filter(p => p.featured);
        return featured.length > 0 ? featured : products.slice(0, 6);
      })
    );
  }

  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    const slugLower = normalizeSlug(categorySlug);
    return this.getAllProducts().pipe(
      map(products => products.filter(p => normalizeSlug(p.categorySlug || p.category) === slugLower))
    );
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getAllProducts().pipe(
      map(products => products.find(p => p.slug === slug || p._id === slug))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getAllProducts().pipe(
      map(products => products.find(p => p._id === id || p.slug === id))
    );
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    // Delegates to the shared categories cache — one request, no fake data.
    // An undefined emission means "collection not found" for this slug.
    return this.categoryService.getCategoryBySlug(slug);
  }
}
