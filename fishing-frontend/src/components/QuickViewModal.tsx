import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { useWishlist } from '../hooks/useWishlist'
import type { Product } from '../types/product'

type Props = {
    product: Product | null
    allProducts?: Product[]
    isOpen: boolean
    onClose: () => void
}

export default function QuickViewModal({ product, allProducts, isOpen, onClose }: Props) {
    const { addItem } = useCart()
    const { showToast } = useToast()
    const { has, toggle } = useWishlist()
    const [currentProduct, setCurrentProduct] = useState<Product | null>(product)

    useEffect(() => {
        setCurrentProduct(product)
    }, [product])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    // КРИТИЧНО: Ако не е отворен, НЕ връщай нищо, за да не пречи на кликовете по сайта
    if (!isOpen || !currentProduct) return null
    if (typeof document === 'undefined') return null

    const handleAddToCart = () => {
        addItem({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            quantity: 1
        })
        window.dispatchEvent(new Event('cart:add'))
        showToast('Продуктът е добавен успешно!')
    }

    const related = (allProducts ?? [])
        .filter((p: Product) => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 3)

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center p-4 z-[9999]"
            onClick={onClose}
        >
            {/* Backdrop - Задният фон е отделен, за да няма конфликти */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Content */}
            <div
                className="relative bg-slate-900 w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden overflow-x-hidden rounded-2xl shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-50 cursor-pointer rounded-lg bg-black/50 p-2 text-white/70 hover:text-white transition-colors backdrop-blur-md"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Снимка */}
                <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-[#0b1b33]">
                    <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Инфо */}
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto overflow-x-hidden">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-turquoise bg-turquoise/10 rounded-full mb-4">
                        {currentProduct.category}
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">{currentProduct.name}</h2>

                    <p className="text-white/70 mb-8 leading-relaxed">
                        {currentProduct.description}
                    </p>

                    <div className="flex items-center justify-between mb-8">
                        <span className="text-4xl font-bold text-turquoise">
                            {currentProduct.price.toFixed(2)} лв.
                        </span>
                    </div>

                    <div className="mb-8 flex w-full max-w-full flex-row flex-wrap items-center gap-[12px]">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={currentProduct.stockQuantity <= 0}
                            className="ui-btn cursor-pointer h-12 bg-turquoise font-bold text-slate-950 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap text-[0.9rem]"
                            style={{ padding: '12px 24px', width: 'auto' }}
                        >
                            Добави в кошницата
                        </button>
                        <button
                            type="button"
                            onClick={() => toggle(currentProduct)}
                            className={[
                                'ui-btn cursor-pointer h-12 flex items-center justify-center gap-2 border border-white/15 bg-white/5 font-bold text-white hover:bg-white/10 whitespace-nowrap text-[0.9rem] leading-none',
                                has(currentProduct.id) ? 'text-turquoise' : 'text-white',
                            ].join(' ')}
                            style={{ padding: '12px 24px', width: 'auto' }}
                        >
                            <svg
                                className="h-5 w-5 shrink-0"
                                viewBox="0 0 24 24"
                                fill={has(currentProduct.id) ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                            </svg>
                            Любими
                        </button>
                        <Link
                            to={`/product/${currentProduct.id}`}
                            onClick={onClose}
                            className="ui-btn cursor-pointer h-12 border border-white/15 bg-white/5 font-bold text-white hover:bg-white/10 whitespace-nowrap text-[0.9rem]"
                            style={{ padding: '12px 24px', width: 'auto' }}
                        >
                            Виж детайли
                        </Link>
                    </div>

                    {/* Related Products Section */}
                    {related.length > 0 && (
                        <div className="border-t border-white/10 pt-6">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">
                                Подобни продукти
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {related.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setCurrentProduct(p)}
                                        className="cursor-pointer flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 hover:opacity-90 hover:scale-[1.02] transition-all border border-white/5 text-left"
                                    >
                                        <img src={p.image} className="w-12 h-12 rounded-lg object-contain bg-[#0b1b33]" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{p.name}</p>
                                            <p className="text-xs text-turquoise">{p.price.toFixed(2)} лв.</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}