"use client"

import { useState } from "react"
import { CreditCard, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function PaymentOptions({setPaymentType,paymentType}:any) {
  const [partialAmount, setPartialAmount] = useState("")

  const totalAmount = 1500 // Example total amount
  const minPartialAmount = totalAmount * 0.3 // Minimum 30% for partial payment

  return (
    <div className="max-w-md mx-auto p-4">
        
        <div className="space-y-6">
        

          {/* Payment Type Selection */}
          <RadioGroup value={paymentType} onValueChange={setPaymentType}>
            <div className="space-y-4">
              {/* Full Payment Option */}
              <div className="relative " dir="rtl">
                <RadioGroupItem value="full" id="full" className="peer sr-only" />
                <Label
                  htmlFor="full"
                  className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">الدفع الكلي</p>
                      <p className="text-sm text-muted-foreground">ادفع المبلغ كاملاً الآن</p>
                    </div>
                  </div>
                
                </Label>
              </div>

              {/* Partial Payment Option */}
              <div className="relative" dir="rtl">
                <RadioGroupItem value="partial" id="partial" className="peer sr-only" />
                <Label
                  htmlFor="partial"
                  className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                 
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">الحد الأدنى</p>
                    <p className="text-sm text-muted-foreground">ادفع فقط مبلغ 0.5 ريال لتأكيد الطلب </p>

                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>


        </div>

       
    </div>
  )
}

