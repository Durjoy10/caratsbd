import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InquiryService } from '../../services/inquiry.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { CustomizationInquiry } from '../../interfaces/inquiry.interface';

@Component({
  selector: 'app-customization-inquiry',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './customization-inquiry.component.html',
  styleUrl: './customization-inquiry.component.scss'
})
export class CustomizationInquiryComponent implements OnInit {
  private inquiryService = inject(InquiryService);
  private route = inject(ActivatedRoute);

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
    this.route.queryParams.subscribe(params => {
      if (params['item']) {
        this.form.description = `I'm interested in a piece similar to "${params['item']}". `;
      }
    });
  }

  onSubmit(): void {
    if (!this.agreed() || this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.inquiryService.submitInquiry(this.form).subscribe({
      next: (res) => {
        this.submitted.set(true);
        this.successMessage.set(res.message);
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.form = { name: '', email: '', phone: '', category: '', description: '', budget: '' };
    this.agreed.set(false);
    this.submitted.set(false);
  }
}
