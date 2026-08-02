import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';

// Fallback products when offline or database has zero products
const MOCK_PRODUCTS: Product[] = [
  // Rings
  { _id: '1', name: 'Aurora Solitaire Ring', category: 'Rings', categorySlug: 'rings', slug: 'aurora-solitaire-ring', description: 'A breathtaking solitaire set in 18K white gold.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'], material: '18K White Gold', featured: true, tags: ['Solitaire', '18K White Gold', 'Diamond'] },
  { _id: '2', name: 'Eternity Band', category: 'Rings', categorySlug: 'rings', slug: 'eternity-band', description: 'Diamonds set along the full circumference.', images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'], material: '18K Yellow Gold', featured: true, tags: ['Band', 'Eternity', 'Gold'] },
  { _id: '3', name: 'Velvet Rose Ring', category: 'Rings', categorySlug: 'rings', slug: 'velvet-rose-ring', description: 'Rose gold band with pavé stones.', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'], material: '18K Rose Gold', tags: ['Rose Gold', 'Pavé'] },
  { _id: '4', name: 'Midnight Sapphire Ring', category: 'Rings', categorySlug: 'rings', slug: 'midnight-sapphire-ring', description: 'Deep blue sapphire centre stone.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'], material: 'Platinum', tags: ['Sapphire', 'Platinum'] },
  // Necklaces
  { _id: '5', name: 'Celestial Pendant', category: 'Necklaces', categorySlug: 'necklaces', slug: 'celestial-pendant', description: 'A delicate star pendant on a fine chain.', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'], material: '18K Gold', featured: true, tags: ['Pendant', 'Star', '18K Gold'] },
  { _id: '6', name: 'Cascade Layered Necklace', category: 'Necklaces', categorySlug: 'necklaces', slug: 'cascade-layered-necklace', description: 'Multi-layer gold chains with diamond accents.', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'], material: '18K Yellow Gold', tags: ['Layered', 'Diamond'] },
  { _id: '7', name: 'Pearl Drop Necklace', category: 'Necklaces', categorySlug: 'necklaces', slug: 'pearl-drop-necklace', description: 'South Sea pearl suspended in gold.', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'], material: '18K White Gold', featured: true, tags: ['Pearl', 'South Sea'] },
  // Bracelets
  { _id: '8', name: 'Dainty Tennis Bracelet', category: 'Bracelets', categorySlug: 'bracelets', slug: 'dainty-tennis-bracelet', description: 'Classic line bracelet with brilliant cut diamonds.', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'], material: '18K White Gold', featured: true, tags: ['Tennis Bracelet', 'Diamonds'] },
  { _id: '9', name: 'Gold Bangle Set', category: 'Bracelets', categorySlug: 'bracelets', slug: 'gold-bangle-set', description: 'Set of three stackable bangles.', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'], material: '22K Gold', tags: ['Bangle', '22K Gold'] },
  // Chains
  { _id: '10', name: 'Cuban Link Chain', category: 'Chains', categorySlug: 'chains', slug: 'cuban-link-chain', description: 'Bold Cuban link in 18K yellow gold.', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'], material: '18K Yellow Gold', featured: true, tags: ['Cuban Link', '18K Gold'] },
  { _id: '11', name: 'Rope Chain', category: 'Chains', categorySlug: 'chains', slug: 'rope-chain', description: 'Elegant twisted rope chain.', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'], material: '18K Gold', tags: ['Rope Chain'] },
  // Earrings
  { _id: '12', name: 'Diamond Stud Earrings', category: 'Earrings', categorySlug: 'earrings', slug: 'diamond-stud-earrings', description: 'Classic round brilliant diamond studs.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'], material: '18K White Gold', featured: true, tags: ['Studs', 'Diamonds'] },
  { _id: '13', name: 'Gold Hoop Earrings', category: 'Earrings', categorySlug: 'earrings', slug: 'gold-hoop-earrings', description: 'Sleek gold hoops in polished finish.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'], material: '18K Yellow Gold', tags: ['Hoops', 'Gold'] },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseLink}${environment.ftpPrefix}`;

  private normalizeProduct(p: any): Product {
    const title = p.name || p.title || 'Untitled Piece';
    const category = p.category || p.categoryName || 'Jewellery';
    const categorySlug = p.categorySlug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const rawImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : [];
    const images = rawImages.length > 0
      ? rawImages
      : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'];

    return {
      _id: p._id || p.id || String(Math.random()),
      catalogNumber: p.catalogNumber || '',
      catalogPage: p.catalogPage,
      bagNo: p.bagNo || '',
      styleCode: p.styleCode || '',
      name: title,
      title: title,
      category: category,
      categoryName: category,
      categorySlug: categorySlug,
      subcategory: p.subcategory || '',
      description: p.description || '',
      images: images,
      baseMetal: p.baseMetal || p.material || '',
      material: p.material || p.baseMetal || '18K Gold',
      grossWeight: p.grossWeight,
      diamondWeight: p.diamondWeight,
      weight: p.grossWeight ? `${p.grossWeight}g` : (p.weight || ''),
      price: p.price,
      priceType: p.priceType,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      showPrice: p.showPrice !== undefined ? Boolean(p.showPrice) : true,
      stockQuantity: p.stockQuantity,
      isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
      featured: p.featured !== undefined ? Boolean(p.featured) : true,
      slug: p.slug || p._id,
      tags: Array.isArray(p.tags) ? p.tags : [],
      createdAt: p.createdAt ? new Date(p.createdAt) : undefined
    };
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/products?limit=100`).pipe(
      map(res => {
        const payload = res.data || res;
        const items = Array.isArray(payload) ? payload : (payload.data || payload.items || []);
        if (Array.isArray(items) && items.length > 0) {
          const activeOnly = items.filter((p: any) => p.isActive !== false);
          if (activeOnly.length > 0) {
            return activeOnly.map(p => this.normalizeProduct(p));
          }
        }
        return MOCK_PRODUCTS;
      }),
      catchError(err => {
        console.warn('Backend API products request failed, using fallback data:', err);
        return of(MOCK_PRODUCTS);
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => {
        const featured = products.filter(p => p.featured);
        return featured.length > 0 ? featured : products.slice(0, 6);
      })
    );
  }

  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    const slugLower = categorySlug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.getAllProducts().pipe(
      map(products => products.filter(p => {
        const pSlug = (p.categorySlug || p.category.toLowerCase()).replace(/[^a-z0-9]+/g, '-');
        return pSlug === slugLower || p.category.toLowerCase() === categorySlug.toLowerCase();
      }))
    );
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getAllProducts().pipe(
      map(products => products.find(p => p.slug === slug || p._id === slug))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getAllProducts().pipe(
      map(products => products.find(p => p._id === id || p.slug === id))
    );
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
      map(res => {
        const list: Category[] = res.data || res || [];
        return list.find(c => c.slug.toLowerCase() === slug.toLowerCase());
      }),
      catchError(() => {
        const categories: Record<string, Category> = {
          rings: { name: 'Rings', slug: 'rings', description: 'Timeless solitaire, eternity, and fashion rings crafted in gold and platinum.', coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80' },
          necklaces: { name: 'Necklaces', slug: 'necklaces', description: 'Pendants, chains, and layered necklaces designed to elevate your everyday elegance.', coverImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80' },
          bracelets: { name: 'Bracelets', slug: 'bracelets', description: 'Classic tennis bracelets, bangles, and delicate gold wristwear.', coverImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80' },
          chains: { name: 'Chains', slug: 'chains', description: 'Bold Cuban links, sleek rope chains, and custom gold links.', coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80' },
          earrings: { name: 'Earrings', slug: 'earrings', description: 'Sparkling studs, hoops, and drop earrings in pure gold and diamonds.', coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80' }
        };
        return of(categories[slug.toLowerCase()]);
      })
    );
  }
}
