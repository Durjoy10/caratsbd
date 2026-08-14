import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product.interface';
import { CustomizationInquiry } from '../interfaces/inquiry.interface';

@Injectable({ providedIn: 'root' })
export class MetaPixelService {
  private platformId = inject(PLATFORM_ID);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const pixelId = environment.metaPixelId;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }

  trackViewContent(product: Product): string {
    if (!isPlatformBrowser(this.platformId)) return '';

    const eventId = uuidv4();

    // Resolve the best price value to send to Meta
    let value: number | undefined;
    if (product.priceType === 'fixed' && product.price) {
      value = product.price;
    } else if (product.priceType === 'range' && product.minPrice) {
      value = product.minPrice;
    }
    // priceType === 'inquiry' → no price, omit value

    if (typeof fbq !== 'undefined') {
      const params: Record<string, any> = {
        content_ids: [product._id],
        content_name: product.name,
        content_category: product.category,
        content_type: 'product',
        currency: 'BDT',
      };
      if (value !== undefined) {
        params['value'] = value;
      }
      fbq('track', 'ViewContent', params, { eventID: eventId });
    }

    return eventId;
  }

  trackLead(form: CustomizationInquiry): string {
    if (!isPlatformBrowser(this.platformId)) return '';

    const eventId = uuidv4();

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: form.category,
        currency: 'BDT',
      }, { eventID: eventId });
    }

    return eventId;
  }
}
