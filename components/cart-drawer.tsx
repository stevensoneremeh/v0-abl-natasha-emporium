"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/cart"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, itemCount, total, updateItem, removeItem, isOpen, openCart, closeCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-luxury-cream hover:text-luxury-gold hover:bg-luxury-charcoal relative"
        >
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-navy text-xs px-1 min-w-[1.25rem] h-5">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg bg-luxury-cream">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-luxury-navy">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-luxury-charcoal/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-luxury-navy mb-2">Your cart is empty</h3>
                <p className="text-luxury-charcoal mb-6">Add some products to get started</p>
                <Button className="btn-luxury" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.products?.images?.[0] || "/placeholder.svg?height=64&width=64"}
                          alt={item.products?.name || "Product"}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-luxury-navy line-clamp-2">
                          {item.products?.name || "Unknown Product"}
                        </h4>
                        <p className="text-sm text-luxury-charcoal">{formatCurrency(item.price)} each</p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateItem(item.product_id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => updateItem(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.product_id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-luxury-navy">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{total >= 50000 ? "Free" : formatCurrency(2500)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (7.5%)</span>
                    <span>{formatCurrency(total * 0.075)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total + (total >= 50000 ? 0 : 2500) + total * 0.075)}</span>
                  </div>
                </div>

                {total >= 50000 ? (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    🎉 You qualify for free shipping!
                  </div>
                ) : (
                  <div className="text-sm text-luxury-charcoal bg-luxury-cream/50 p-2 rounded">
                    Add {formatCurrency(50000 - total)} more for free shipping
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full btn-luxury" asChild onClick={closeCart}>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
