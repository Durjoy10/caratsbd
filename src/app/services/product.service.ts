import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Category } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';

// Mock data for development (replace with real API calls)
const MOCK_PRODUCTS: Product[] = [
  // Rings
  { _id: '1', name: 'Aurora Solitaire Ring', category: 'Rings', categorySlug: 'rings', slug: 'aurora-solitaire-ring', description: 'A breathtaking solitaire set in 18K white gold.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80'], material: '18K White Gold', featured: true, tags: ['Solitaire', '18K White Gold', 'Diamond'] },
  { _id: '2', name: 'Eternity Band', category: 'Rings', categorySlug: 'rings', slug: 'eternity-band', description: 'Diamonds set along the full circumference.', images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80'], material: '18K Yellow Gold', featured: true, tags: ['Band', 'Eternity', 'Gold'] },
  { _id: '3', name: 'Velvet Rose Ring', category: 'Rings', categorySlug: 'rings', slug: 'velvet-rose-ring', description: 'Rose gold band with pavé stones.', images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'], material: '18K Rose Gold', tags: ['Rose Gold', 'Pavé'] },
  { _id: '4', name: 'Midnight Sapphire Ring', category: 'Rings', categorySlug: 'rings', slug: 'midnight-sapphire-ring', description: 'Deep blue sapphire centre stone.', images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80'], material: 'Platinum', tags: ['Sapphire', 'Platinum'] },
  // Necklaces
  { _id: '5', name: 'Celestial Pendant', category: 'Necklaces', categorySlug: 'necklaces', slug: 'celestial-pendant', description: 'A delicate star pendant on a fine chain.', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'], material: '18K Gold', featured: true, tags: ['Pendant', 'Star', '18K Gold'] },
  { _id: '6', name: 'Cascade Layered Necklace', category: 'Necklaces', categorySlug: 'necklaces', slug: 'cascade-layered-necklace', description: 'Multi-layer gold chains with diamond accents.', images: ['https://images.unsplash.com/photo-1599459182681-c938b7f65b6d?w=600&q=80'], material: '18K Yellow Gold', tags: ['Layered', 'Diamond'] },
  { _id: '7', name: 'Pearl Drop Necklace', category: 'Necklaces', categorySlug: 'necklaces', slug: 'pearl-drop-necklace', description: 'South Sea pearl suspended in gold.', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80'], material: '18K White Gold', featured: true, tags: ['Pearl', 'South Sea'] },
  // Bracelets
  { _id: '8', name: 'Dainty Tennis Bracelet', category: 'Bracelets', categorySlug: 'bracelets', slug: 'dainty-tennis-bracelet', description: 'Classic line bracelet with brilliant cut diamonds.', images: ['https://images.unsplash.com/photo-1573408301185-9519f94815d7?w=600&q=80'], material: '18K White Gold', featured: true, tags: ['Tennis Bracelet', 'Diamonds'] },
  { _id: '9', name: 'Gold Bangle Set', category: 'Bracelets', categorySlug: 'bracelets', slug: 'gold-bangle-set', description: 'Set of three stackable bangles.', images: ['https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80'], material: '22K Gold', tags: ['Bangle', '22K Gold'] },
  // Chains
  { _id: '10', name: 'Cuban Link Chain', category: 'Chains', categorySlug: 'chains', slug: 'cuban-link-chain', description: 'Bold Cuban link in 18K yellow gold.', images: ['https://images.unsplash.com/photo-1610483172917-4f80beb00d22?w=600&q=80'], material: '18K Yellow Gold', featured: true, tags: ['Cuban Link', '18K Gold'] },
  { _id: '11', name: 'Rope Chain', category: 'Chains', categorySlug: 'chains', slug: 'rope-chain', description: 'Elegant twisted rope chain.', images: ['https://images.unsplash.com/photo-1630760538826-6b30b26c7d64?w=600&q=80'], material: '18K Gold', tags: ['Rope Chain'] },
  // Earrings
  { _id: '12', name: 'Diamond Stud Earrings', category: 'Earrings', categorySlug: 'earrings', slug: 'diamond-stud-earrings', description: 'Classic round brilliant diamond studs.', images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80'], material: '18K White Gold', featured: true, tags: ['Studs', 'Diamonds'] },
  { _id: '13', name: 'Gold Hoop Earrings', category: 'Earrings', categorySlug: 'earrings', slug: 'gold-hoop-earrings', description: 'Sleek gold hoops in polished finish.', images: ['https://images.unsplash.com/photo-1630760535688-742d99adf851?w=600&q=80'], material: '18K Yellow Gold', tags: ['Hoops', 'Gold'] },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getFeaturedProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => p.featured));
  }

  getProductsByCategory(categorySlug: string): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => (p.categorySlug || p.category.toLowerCase()) === categorySlug.toLowerCase()));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return of(MOCK_PRODUCTS.find(p => p.slug === slug || p._id === slug));
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(MOCK_PRODUCTS.find(p => p._id === id || p.slug === id));
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    const categories: Record<string, Category> = {
      rings: { name: 'Rings', slug: 'rings', description: 'Timeless solitaire, eternity, and fashion rings crafted in gold and platinum.', coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80' },
      necklaces: { name: 'Necklaces', slug: 'necklaces', description: 'Pendants, chains, and layered necklaces designed to elevate your everyday elegance.', coverImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=80' },
      bracelets: { name: 'Bracelets', slug: 'bracelets', description: 'Classic tennis bracelets, bangles, and delicate gold wristwear.', coverImage: 'https://images.unsplash.com/photo-1573408301185-9519f94815d7?w=1600&q=80', image: 'https://images.unsplash.com/photo-1573408301185-9519f94815d7?w=1600&q=80' },
      chains: { name: 'Chains', slug: 'chains', description: 'Bold Cuban links, sleek rope chains, and custom gold links.', coverImage: 'https://images.unsplash.com/photo-1610483172917-4f80beb00d22?w=1600&q=80', image: 'https://images.unsplash.com/photo-1610483172917-4f80beb00d22?w=1600&q=80' },
      earrings: { name: 'Earrings', slug: 'earrings', description: 'Sparkling studs, hoops, and drop earrings in pure gold and diamonds.', coverImage: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80' }
    };
    return of(categories[slug.toLowerCase()]);
  }

  getAllProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }
}
