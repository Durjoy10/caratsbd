import { Component, OnInit, inject, signal, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../interfaces/product.interface';
import { InquiryService } from '../../../services/inquiry.service';
import { ShopInfoService, ShopInfo } from '../../../services/shop-info.service';

@Component({
  selector: 'app-inquiry-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './inquiry-modal.component.html',
  styleUrl: './inquiry-modal.component.scss'
})
export class InquiryModalComponent implements OnInit {
  private inquiryService = inject(InquiryService);
  private shopInfoService = inject(ShopInfoService);

  visible = input<boolean>(false);
  product = input<Product | null>(null);
  close = output<void>();

  readonly shopInfo = signal<ShopInfo | undefined>(undefined);

  form = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.onOpen();
      }
    });
  }

  ngOnInit(): void {
    this.shopInfoService.getShopInfo().subscribe(info => this.shopInfo.set(info));
  }

  onOpen(): void {
    const prod = this.product();
    const catalogInfo = prod?.catalogNumber ? ` (Catalog #: ${prod.catalogNumber})` : '';
    this.form.message = prod
      ? `I would like to inquire about "${prod.name}"${catalogInfo}. Please share pricing, custom gold options, and availability.`
      : 'I would like to make an inquiry about a custom piece.';
  }

  onSubmit(): void {
    if (!this.form.name || !this.form.phone || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const prod = this.product();
    const productLink = typeof window !== 'undefined' ? window.location.href : '';
    const catalogText = prod?.catalogNumber ? ` [Catalog #${prod.catalogNumber}]` : '';

    const payload = {
      type: 'customization',
      name: this.form.name,
      phone: this.form.phone,
      email: this.form.email || 'N/A',
      category: prod?.category || 'Custom Jewellery',
      description: `${this.form.message}\n\n[Product: ${prod?.name || 'Custom Piece'}${catalogText} | Link: ${productLink}]`,
      budget: 'Inquiry on Piece'
    };

    this.inquiryService.submitInquiry(payload).subscribe({
      next: () => {
        this.sendWhatsAppOrder(prod, productLink);
        this.submitted.set(true);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Inquiry submit error:', err);
        this.sendWhatsAppOrder(prod, productLink);
        this.submitted.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  private sendWhatsAppOrder(prod: Product | null, link: string): void {
    const info = this.shopInfo();
    const rawNumber = info?.customizationWhatsapp || info?.whatsapp || '+8801800000000';
    const waNumber = rawNumber.replace(/[^0-9]/g, '');

    let text = `*New Product Request via Website*\n\n` +
      `💎 *Piece:* ${prod?.name || 'Custom Jewellery'}\n`;

    if (prod?.catalogNumber) {
      text += `🏷️ *Catalog #:* ${prod.catalogNumber}\n`;
    }
    if (prod?.styleCode) {
      text += `✨ *Style Code:* ${prod.styleCode}\n`;
    }

    text += `🔗 *Product Link:* ${link}\n\n` +
      `👤 *Customer Name:* ${this.form.name}\n` +
      `📞 *Phone Number:* ${this.form.phone}\n`;

    if (this.form.email) {
      text += `✉️ *Email:* ${this.form.email}\n`;
    }

    text += `\n💬 *Customer Note:*\n${this.form.message}`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  handleClose(): void {
    this.submitted.set(false);
    this.close.emit();
  }
}
