/**
 * Admin Panel Types
 */

export type UserRole = "admin" | "user" | "restaurant_owner";

export interface AdminUser {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "restaurant_owner";
  joinedDate: Date;
  preferences?: string;
}

export interface RestaurantLead {
  id: string;
  restaurantName: string;
  contactEmail: string;
  phone: string;
  city: string;
  message?: string;
  submittedDate: Date;
  status: "new" | "contacted" | "interested" | "partner";
}

export interface Analytics {
  totalWaitlistUsers: number;
  totalRestaurantLeads: number;
  signupsLast7Days: number;
  restaurantLeadsLast7Days: number;
  conversionRate: number;
}

export interface PlatformSettings {
  launchDate: string;
  heroHeadline: string;
  enableWaitlist: boolean;
  enablePartnerSignup: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Date;
  status: "new" | "read" | "replied";
}

export interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAdminRole: (uid: string) => Promise<boolean>;
}
