import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ShopInfoService, ShopInfo } from '../../services/shop-info.service';
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  private shopInfoService = inject(ShopInfoService);
  private inquiryService = inject(InquiryService);
  private sanitizer = inject(DomSanitizer);

  readonly shopInfo = signal<ShopInfo | undefined>(undefined);
  readonly messageSent = signal(false);
  readonly isSubmitting = signal(false);

  readonly mapEmbedUrl = computed<SafeResourceUrl>(() => {
    const rawUrl = this.shopInfo()?.googleMapEmbedUrl ||
      'https://maps.google.com/maps?q=Carats,+Gulshan+Pink+City+Shopping+Center,+Gulshan+Ave,+Dhaka+1212&t=&z=16&ie=UTF8&iwloc=&output=embed';
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  });

  readonly mapDirectUrl = computed<string>(() => {
    return this.shopInfo()?.googleMapUrl || 'https://maps.app.goo.gl/4ADAdwwgCSVNa4xx8?g_st=ic';
  });

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  ngOnInit(): void {
    this.shopInfoService.getShopInfo().subscribe(info => this.shopInfo.set(info));
  }

  sendMessage(): void {
    if (this.isSubmitting() || !this.contactForm.name || !this.contactForm.email || !this.contactForm.message) return;

    this.isSubmitting.set(true);

    const name = this.contactForm.name;
    const email = this.contactForm.email;
    const subject = this.contactForm.subject || 'General Inquiry';
    const message = this.contactForm.message;

    const payload = {
      type: 'contact',
      name: name || 'Website Visitor',
      email: email,
      category: subject || 'General Contact',
      description: message || 'General message from website contact form.',
      phone: 'N/A'
    };

    this.inquiryService.submitInquiry(payload).subscribe({
      next: () => {
        this.openWhatsAppInquiry(name, email, subject, message);
        this.messageSent.set(true);
        this.isSubmitting.set(false);
        this.contactForm = { name: '', email: '', subject: '', message: '' };
      },
      error: (err) => {
        console.error('Contact form submission error:', err);
        this.openWhatsAppInquiry(name, email, subject, message);
        this.messageSent.set(true);
        this.isSubmitting.set(false);
        this.contactForm = { name: '', email: '', subject: '', message: '' };
      }
    });
  }

  private openWhatsAppInquiry(name: string, email: string, subject: string, message: string): void {
    const rawNumber = this.shopInfo()?.whatsapp || '+8801234567890';
    const waNumber = rawNumber.replace(/[^0-9]/g, '');
    const text = `*New General Inquiry via Website*\n\n` +
      `👤 *Name:* ${name}\n` +
      `✉️ *Email:* ${email}\n` +
      `📌 *Subject:* ${subject}\n\n` +
      `💬 *Message:*\n${message}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }
}
