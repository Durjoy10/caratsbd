import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, shareReplay } from 'rxjs';
import { Category } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  private categoriesCache$: Observable<Category[]> | null = null;

  getCategories(): Observable<Category[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
        map(res => {
          const list = res.data || res || [];
          return list.sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0));
        }),
        shareReplay(1),
        catchError(err => {
          console.error('Failed to fetch dynamic categories:', err);
          return of([]);
        })
      );
    }
    return this.categoriesCache$;
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(c => c.slug.toLowerCase() === slug.toLowerCase()))
    );
  }
}
