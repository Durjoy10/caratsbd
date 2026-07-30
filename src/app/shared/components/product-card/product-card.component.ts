import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  product = input.required<Product>();
  index = input<number>(0);
  hovered = signal(false);

  displayPrice(p: Product): string {
    if (p.priceType === 'inquiry' || p.showPrice === false) {
      return 'Price on Inquiry';
    }
    if (p.priceType === 'range' || (p.minPrice && p.maxPrice)) {
      const min = p.minPrice ? p.minPrice.toLocaleString() : '0';
      const max = p.maxPrice ? p.maxPrice.toLocaleString() : '0';
      return `৳ ${min} – ৳ ${max}`;
    }
    if (p.price && p.price > 0) {
      return `৳ ${p.price.toLocaleString()}`;
    }
    return 'Price on Inquiry';
  }
}
