import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input() revealThreshold = 0.15;

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const native = this.el.nativeElement as HTMLElement;
    native.style.opacity = '0';
    native.style.transform = 'translateY(24px)';
    native.style.transition = `opacity 0.8s ease ${this.revealDelay}ms, transform 0.8s ease ${this.revealDelay}ms`;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              native.style.opacity = '1';
              native.style.transform = 'translateY(0)';
              this.observer?.unobserve(native);
            }
          });
        },
        { threshold: this.revealThreshold }
      );
      this.observer.observe(native);
    } else {
      native.style.opacity = '1';
      native.style.transform = 'translateY(0)';
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
