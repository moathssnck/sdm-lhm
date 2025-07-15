"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-green-600 font-bold">{item.price} ر.ع</p>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-12 text-center font-semibold">{item.quantity}</span>

            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-left">
            <p className="font-bold text-lg">{(item.price * item.quantity).toFixed(2)} ر.ع</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 ml-1" />
              حذف
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
