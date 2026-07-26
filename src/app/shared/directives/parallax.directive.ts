import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input() parallaxSpeed = 0.4;

  private ticking = false;
  private boundHandler!: () => void;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.boundHandler = this.onScroll.bind(this);
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.boundHandler, { passive: true });
    });
  }

  private onScroll(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.bottom > 0 && rect.top < windowH) {
          const offset = (rect.top - windowH / 2) * this.parallaxSpeed;
          this.el.nativeElement.style.transform = `translateY(${offset}px)`;
        }
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.boundHandler);
  }
}
