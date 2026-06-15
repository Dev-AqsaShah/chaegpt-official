// PaymentProvider abstraction
// COD and MOCK_CARD work out of the box with no API keys.
// Stripe activates only when STRIPE_SECRET_KEY is present in .env.
// TODO: add JazzCash / Easypaisa adapter here.

export type PaymentProvider = "COD" | "MOCK_CARD" | "STRIPE";

export function getAvailablePaymentMethods(): PaymentProvider[] {
  const methods: PaymentProvider[] = ["COD", "MOCK_CARD"];
  if (process.env.STRIPE_SECRET_KEY) methods.push("STRIPE");
  return methods;
}

export async function processMockCard(_amount: number): Promise<{ success: true; transactionId: string }> {
  // Simulates a successful card payment — no real money moved.
  await new Promise((r) => setTimeout(r, 800));
  return { success: true, transactionId: `MOCK-${Date.now()}` };
}

export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function calcDeliveryFee(subtotal: number): number {
  if (subtotal >= 1000) return 0; // free delivery over Rs. 1000
  return 100;
}
