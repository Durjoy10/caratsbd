import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly messageSent = signal(false);

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  sendMessage(): void {
    console.log('Contact message:', this.contactForm);
    this.messageSent.set(true);
    this.contactForm = { name: '', email: '', subject: '', message: '' };
  }
}
