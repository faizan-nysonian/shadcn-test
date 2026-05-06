export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";

export type CustomerTier = "bronze" | "silver" | "gold" | "platinum";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  product: string;
  category: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  region: string;
}

export interface SupportTicket {
  id: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgent: string;
  createdAt: Date;
  resolvedAt?: Date;
  tags: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  tier: CustomerTier;
  joinedAt: Date;
  region: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  ticketsResolved: number;
  avgResolutionHours: number;
  satisfaction: number;
  isOnline: boolean;
}

export interface StatsCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  trend: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface TimeSeriesPoint {
  date: string;
  orders: number;
  revenue: number;
  tickets: number;
}
