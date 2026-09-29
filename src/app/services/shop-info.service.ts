import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, tap, catchError, shareReplay, retry, defer, throwError, timer } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StatItem {
  value: string;
  label: string;
}

export interface ShopInfo {
  name: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsapp: string;
  customizationWhatsapp?: string;
  email: string;
  address: string;
  hours: string;
  googleMapUrl?: string;
  googleMapEmbedUrl?: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  currencySymbol: string;
  currencyCode: string;
  metaDescription: string;

  heroBgImage?: string;
  heroBannerImage?: string;
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroSubtitle?: string;
  heroButton1Text?: string;
  heroButton1Link?: string;
  heroButton2Text?: string;
  heroButton2Link?: string;

  promoBgImage?: string;
  promoQuoteText?: string;
  promoQuoteAuthor?: string;
  promoBannerImage?: string;
  promoEyebrow?: string;
  promoTitle?: string;
  promoSubtitle?: string;
  promoButtonText?: string;
  promoButtonLink?: string;

  customizationBannerImage?: string;
  contactBannerImage?: string;

  statsItems?: StatItem[];
}

@Injectable({ providedIn: 'root' })
export class ShopInfoService {
  private http = inject(HttpClient);
  private shopInfoCache$: Observable<ShopInfo> | null = null;
  readonly shopInfo = signal<ShopInfo | null>(null);

  getShopInfo(): Observable<ShopInfo> {
    // One shared request for the whole session (navbar, footer, pages all
    // subscribe); retried on transient network/server errors like products.
    if (!this.shopInfoCache$) {
      const apiUrl = `${environment.apiBaseLink}${environment.ftpPrefix}`;
      this.shopInfoCache$ = defer(() => this.http.get<any>(`${apiUrl}/shop-info`)).pipe(
        retry({
          count: 2,
          delay: (err: HttpErrorResponse, attempt: number) =>
            err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500
              ? throwError(() => err)
              : timer(400 * (attempt + 1))
        }),
        map(res => res.data || res),
        tap(info => this.shopInfo.set(info)),
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((err: HttpErrorResponse) => {
          // Reset so the next navigation retries instead of being stuck.
          this.shopInfoCache$ = null;
          return throwError(() => err);
        })
      );
    }
    return this.shopInfoCache$;
  }
}
