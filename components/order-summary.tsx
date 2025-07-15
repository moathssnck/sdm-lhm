import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrderSummaryProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const deliveryFee = 0
  const tax = total * 0.15 // 15% VAT
  const finalTotal = total + deliveryFee + tax

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
              </div>
              <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} ر.س</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>المجموع الفرعي:</span>
            <span>{total.toFixed(2)} ر.س</span>
          </div>

          <div className="flex justify-between">
            <span>رسوم التوصيل:</span>
            <span>{deliveryFee === 0 ? "مجاني" : `${deliveryFee} ر.س`}</span>
          </div>

          <div className="flex justify-between">
            <span>ضريبة القيمة المضافة (15%):</span>
            <span>{tax.toFixed(2)} ر.س</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>المجموع الكلي:</span>
              <span>{finalTotal.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700">✓ توصيل مجاني لجميع الطلبات</p>
          <p className="text-sm text-green-700">✓ ضمان الجودة والطزاجة</p>
        </div>
      </CardContent>
    </Card>
  )
}
