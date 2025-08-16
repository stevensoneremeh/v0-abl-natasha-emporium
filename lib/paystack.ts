export interface PaystackConfig {
  publicKey: string
  secretKey: string
}

export interface PaystackPaymentData {
  email: string
  amount: number // in kobo (multiply by 100)
  currency?: string
  reference?: string
  callback_url?: string
  metadata?: Record<string, any>
  channels?: string[]
}

export interface PaystackResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerificationResponse {
  status: boolean
  message: string
  data?: {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: string
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: Record<string, any>
    log: any
    fees: number
    fees_split: any
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string
    }
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string
      metadata: Record<string, any>
      risk_action: string
      international_format_phone: string
    }
    plan: any
    split: any
    order_id: any
    paidAt: string
    createdAt: string
    requested_amount: number
    pos_transaction_data: any
    source: any
    fees_breakdown: any
  }
}

// Generate a unique reference for the transaction
export function generatePaymentReference(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `ABL_${timestamp}_${random}`
}

// Initialize Paystack payment
export async function initializePayment(paymentData: PaystackPaymentData): Promise<PaystackResponse> {
  const response = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    throw new Error("Failed to initialize payment")
  }

  return response.json()
}

// Verify payment
export async function verifyPayment(reference: string): Promise<PaystackVerificationResponse> {
  const response = await fetch(`/api/paystack/verify?reference=${reference}`)

  if (!response.ok) {
    throw new Error("Failed to verify payment")
  }

  return response.json()
}

// Convert amount to kobo (Paystack uses kobo)
export function toKobo(amount: number): number {
  return Math.round(amount * 100)
}

// Convert amount from kobo to naira
export function fromKobo(amount: number): number {
  return amount / 100
}
