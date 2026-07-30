import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InquiryService } from '../../services/inquiry.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { CustomizationInquiry } from '../../interfaces/inquiry.interface';
import { ShopInfoService, ShopInfo } from '../../services/shop-info.service';

@Component({
  selector: 'app-customization-inquiry',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './customization-inquiry.component.html',
  styleUrl: './customization-inquiry.component.scss'
})
export class CustomizationInquiryComponent implements OnInit {
  private inquiryService = inject(InquiryService);
  private shopInfoService = inject(ShopInfoService);
  private route = inject(ActivatedRoute);

  readonly shopInfo = signal<ShopInfo | undefined>(undefined);

  form: CustomizationInquiry = {
    name: '', email: '', phone: '', category: '', description: '', budget: ''
  };

  readonly agreed = signal(false);
  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');

  readonly processSteps = [
    { num: '01', title: 'Share Your Vision', desc: 'Submit your inquiry with details about the piece you\'re imagining — style, material, occasion, and budget.' },
    { num: '02', title: 'Design Consultation', desc: 'Our team connects with you within 24 hours to understand your vision and provide expert guidance.' },
    { num: '03', title: 'Sketch & Approval', desc: 'We craft detailed sketches and material samples for your review. Nothing moves forward without your approval.' },
    { num: '04', title: 'Handcrafted & Delivered', desc: 'Master artisans bring your vision to life. Your finished piece is delivered with a certificate of authenticity.' }
  ];

  ngOnInit(): void {
    this.shopInfoService.getShopInfo().subscribe(info => this.shopInfo.set(info));
    this.route.queryParams.subscribe(params => {
      if (params['item']) {
        this.form.description = `I'm interested in a piece similar to "${params['item']}". `;
      }
    });
  }

  onSubmit(): void {
    if (!this.agreed() || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const inquiryData = {
      type: 'customization',
      name: this.form.name || 'Anonymous Client',
      email: this.form.email,
      phone: this.form.phone || 'N/A',
      category: this.form.category || 'Customization',
      description: this.form.description || 'Customization request via website.',
      budget: this.form.budget || 'Not specified'
    };

    this.inquiryService.submitInquiry(inquiryData).subscribe({
      next: (res) => {
        this.openWhatsAppCustomization(this.form);
        this.submitted.set(true);
        this.successMessage.set(res?.message || 'Your inquiry has been received. We will contact you within 24 hours.');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Inquiry submission error:', err);
        // Fallback: Open WhatsApp even if server responds with error
        this.openWhatsAppCustomization(this.form);
        this.submitted.set(true);
        this.successMessage.set('Your customization request has been forwarded to our team.');
        this.isSubmitting.set(false);
      }
    });
  }

  private openWhatsAppCustomization(data: CustomizationInquiry): void {
    const info = this.shopInfo();
    const rawNumber = info?.customizationWhatsapp || info?.whatsapp || '+8801800000000';
    const waNumber = rawNumber.replace(/[^0-9]/g, '');

    const text = `*New Customization Request via Website*\n\n` +
      `👤 *Name:* ${data.name}\n` +
      `✉️ *Email:* ${data.email}\n` +
      `📞 *Phone:* ${data.phone}\n` +
      `💎 *Jewellery Type:* ${data.category || 'Custom'}\n` +
      `💰 *Approx Budget:* ${data.budget || 'Not specified'}\n\n` +
      `🎨 *Vision Description:*\n${data.description}`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  resetForm(): void {
    this.form = { name: '', email: '', phone: '', category: '', description: '', budget: '' };
    this.agreed.set(false);
    this.submitted.set(false);
  }
}
