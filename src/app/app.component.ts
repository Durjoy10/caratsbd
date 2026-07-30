import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { ShopInfoService } from './services/shop-info.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'carats';
  private themeService = inject(ThemeService);
  private shopInfoService = inject(ShopInfoService);

  ngOnInit(): void {
    this.shopInfoService.getShopInfo().subscribe({
      next: (info) => {
        if (info?.faviconUrl) {
          this.setFavicon(info.faviconUrl);
        }
      }
    });
  }

  private setFavicon(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;
  }
}
