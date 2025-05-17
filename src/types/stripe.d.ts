declare module '@stripe/stripe-js' {
  export interface Stripe {
    // Add any Stripe methods you're using
    createPaymentMethod: (options: any) => Promise<any>
  }

  export function loadStripe(publicKey: string): Promise<Stripe | null>
}