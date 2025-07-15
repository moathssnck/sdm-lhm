// Simplified Payment Gateway for Card-only payments with OTP
export interface PaymentGateway {
    id: string
    name: string
    nameAr: string
    logo: string
    supportedCards: string[]
    fees: {
      percentage: number
      fixed: number
    }
    currency: string
    isActive: boolean
    requiresOTP: boolean
  }
  
  export const omanPaymentGateways: PaymentGateway[] = [
    {
      id: "bank_muscat_card",
      name: "Bank Muscat Card Payment",
      nameAr: "بنك مسقط - دفع بالبطاقة",
      logo: "/placeholder.svg?height=40&width=120&text=Bank+Muscat",
      supportedCards: ["visa", "mastercard", "amex"],
      fees: { percentage: 2.5, fixed: 0.1 },
      currency: "OMR",
      isActive: true,
      requiresOTP: true,
    },
    {
      id: "nbo_card",
      name: "NBO Card Payment",
      nameAr: "البنك الأهلي العماني - دفع بالبطاقة",
      logo: "/placeholder.svg?height=40&width=120&text=NBO",
      supportedCards: ["visa", "mastercard"],
      fees: { percentage: 2.3, fixed: 0.05 },
      currency: "OMR",
      isActive: true,
      requiresOTP: true,
    },
    {
      id: "bank_dhofar_card",
      name: "Bank Dhofar Card Payment",
      nameAr: "بنك ظفار - دفع بالبطاقة",
      logo: "/placeholder.svg?height=40&width=120&text=Bank+Dhofar",
      supportedCards: ["visa", "mastercard", "amex"],
      fees: { percentage: 2.4, fixed: 0.08 },
      currency: "OMR",
      isActive: true,
      requiresOTP: true,
    },
  ]
  
  export interface PaymentRequest {
    amount: number
    currency: string
    orderId: string
    customerInfo: {
      name: string
      email: string
      phone: string
    }
    cardInfo: {
      cardNumber: string
      cardName: string
      expiryMonth: string
      expiryYear: string
      cvv: string
    }
    gateway: string
  }
  
  export interface OTPRequest {
    transactionId: string
    phone: string
    gateway: string
  }
  
  export interface OTPVerification {
    transactionId: string
    otpCode: string
    gateway: string
  }
  
  export interface PaymentResponse {
    success: boolean
    transactionId?: string
    requiresOTP?: boolean
    otpSent?: boolean
    error?: string
    gatewayResponse?: any
  }
  
  // Mock Payment Gateway Service with OTP
  export class PaymentGatewayService {
    static async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
  
      const gateway = omanPaymentGateways.find((g) => g.id === request.gateway)
      if (!gateway) {
        return { success: false, error: "بوابة الدفع غير متوفرة" }
      }
  
      // Validate card number (basic validation)
      const cardNumber = request.cardInfo.cardNumber.replace(/\s/g, "")
      if (cardNumber.length < 16) {
        return { success: false, error: "رقم البطاقة غير صحيح" }
      }
  
      // Simulate card validation
      const isCardValid = Math.random() > 0.05 // 95% success rate for demo
  
      if (!isCardValid) {
        return {
          success: false,
          error: "البطاقة مرفوضة. يرجى التحقق من البيانات أو استخدام بطاقة أخرى",
        }
      }
  
      // Generate transaction ID and initiate OTP
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
      return {
        success: true,
        transactionId,
        requiresOTP: gateway.requiresOTP,
        otpSent: true,
        gatewayResponse: {
          status: "otp_required",
          message: "تم إرسال رمز التحقق إلى هاتفك المحمول",
          expiresIn: 300, // 5 minutes
        },
      }
    }
  
    static async sendOTP(request: OTPRequest): Promise<{ success: boolean; message: string }> {
      // Simulate OTP sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      // Generate mock OTP (in real implementation, this would be sent via SMS)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  
      // Store OTP in session/memory (in real app, this would be in secure storage)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`otp_${request.transactionId}`, otpCode)
      }
  
      console.log(`OTP for transaction ${request.transactionId}: ${otpCode}`) // For demo purposes
  
      return {
        success: true,
        message: `تم إرسال رمز التحقق إلى ${request.phone.slice(-4).padStart(request.phone.length, "*")}`,
      }
    }
  
    static async verifyOTP(request: OTPVerification): Promise<PaymentResponse> {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
  
      // Get stored OTP (in real app, this would be verified server-side)
      let storedOTP = ""
      if (typeof window !== "undefined") {
        storedOTP = sessionStorage.getItem(`otp_${request.transactionId}`) || ""
      }
  
      if (request.otpCode !== storedOTP) {
        return {
          success: false,
          error: "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى",
        }
      }
  
      // Clear OTP after successful verification
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`otp_${request.transactionId}`)
      }
  
      // Simulate final payment processing
      const isPaymentSuccess = Math.random() > 0.02 // 98% success rate after OTP
  
      if (isPaymentSuccess) {
        return {
          success: true,
          transactionId: request.transactionId,
          gatewayResponse: {
            status: "completed",
            message: "تم الدفع بنجاح",
            timestamp: new Date().toISOString(),
          },
        }
      } else {
        return {
          success: false,
          error: "فشل في معالجة الدفع. يرجى المحاولة مرة أخرى",
        }
      }
    }
  
    static async resendOTP(transactionId: string, phone: string): Promise<{ success: boolean; message: string }> {
      // Simulate resend delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      // Generate new OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`otp_${transactionId}`, otpCode)
      }
  
      console.log(`New OTP for transaction ${transactionId}: ${otpCode}`) // For demo purposes
  
      return {
        success: true,
        message: "تم إعادة إرسال رمز التحقق",
      }
    }
  }
  