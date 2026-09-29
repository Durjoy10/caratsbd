import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, shareReplay, retry, defer, throwError, timer } from 'rxjs';
import { Category } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { normalizeSlug } from '../shared/utils/slug.utils';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  private categoriesCache$: Observable<Category[]> | null = null;

  getCategories(): Observable<Category[]> {
    if (!this.categoriesCache$) {
      const apiUrl = `${environment.apiBaseLink}${environment.ftpPrefix}`;
      this.categoriesCache$ = defer(() => this.http.get<any>(`${apiUrl}/categories`)).pipe(
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
          const list: Category[] = res.data || res || [];
          // Normalize slugs once at the source: the live API stores some
          // slugs with trailing hyphens ("rings-", "earrings-").
          return list.map(c => ({ ...c, slug: normalizeSlug(c.slug) }));
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError(err => {
          console.error('Failed to fetch dynamic categories:', err);
          // Reset so the next navigation retries instead of being stuck
          // with a permanently cached empty list (causes "0 items").
          // Re-throw so pages can show their error/retry state — no fake data.
          this.categoriesCache$ = null;
          return throwError(() => err);
        })
      );
    }
    return this.categoriesCache$;
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(c => normalizeSlug(c.slug) === normalizeSlug(slug)))
    );
  }
}
