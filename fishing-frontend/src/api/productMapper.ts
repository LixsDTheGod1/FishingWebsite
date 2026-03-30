import type { ProductDTO } from './types'
import type { Product } from '../types/product'

const unsplashById: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1545459720-aac0929a8c5c?w=800&q=80',
  2: 'https://images.unsplash.com/photo-1504280396547-797e31ad6a58?w=800&q=80',
  3: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
  4: 'https://images.unsplash.com/photo-1583212292454-1fe62296061b?w=800&q=80',
  5: 'https://images.unsplash.com/photo-1530124566582-e98886188ead?w=800&q=80',
  6: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
}

function placeholderImage(id: number): string {
  return (
    unsplashById[id] ??
    `https://picsum.photos/seed/fishing-product-${id}/800/600`
  )
}

export function mapProductDto(dto: ProductDTO): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    price: dto.price,
    stockQuantity: dto.stockQuantity,
    image: dto.imageUrl ?? placeholderImage(dto.id),
    category: dto.category,
  }
}
