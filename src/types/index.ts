// Shared application types

export type OrderStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderTypeType = "DELIVERY" | "PICKUP";
export type PaymentMethodType = "COD" | "MOCK_CARD" | "STRIPE";
export type PaymentStatusType = "UNPAID" | "PAID" | "REFUNDED";
export type ReservationStatusType = "PENDING" | "CONFIRMED" | "CANCELLED";
export type UserRoleType = "CUSTOMER" | "ADMIN";

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selectedOptions: SelectedOption[];
}

export interface SelectedOption {
  groupName: string;
  label: string;
  priceDelta: number;
}

export interface MenuItemWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  spiceLevel: number;
  tags: string;
  isAvailable: boolean;
  category: { id: string; name: string; slug: string; emoji: string | null };
  options: { id: string; groupName: string; label: string; priceDelta: number }[];
}

export interface OrderStatusStep {
  status: OrderStatusType;
  label: string;
  done: boolean;
  current: boolean;
}
