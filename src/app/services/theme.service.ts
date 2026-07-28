import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('carats-theme');
      const prefersDark = saved === 'dark';
      this.isDark.set(prefersDark);
      this.applyTheme(prefersDark);
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const dark = this.isDark();
        this.applyTheme(dark);
        localStorage.setItem('carats-theme', dark ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private applyTheme(dark: boolean): void {
    const html = document.documentElement;
    if (dark) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', dark ? '#0A0A0A' : '#FAFAF7');
    }
  }
}
