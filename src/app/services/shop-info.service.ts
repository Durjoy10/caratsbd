import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  email: string;
  address: string;
  hours: string;
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
  promoBannerImage?: string;
  promoEyebrow?: string;
  promoTitle?: string;
  promoSubtitle?: string;
  promoButtonText?: string;
  promoButtonLink?: string;

  statsItems?: StatItem[];
}

@Injectable({ providedIn: 'root' })
export class ShopInfoService {
  private http = inject(HttpClient);

  getShopInfo(): Observable<ShopInfo> {
    return this.http.get<any>(`${environment.apiUrl}/shop-info`).pipe(
      map(res => res.data || res)
    );
  }
}
