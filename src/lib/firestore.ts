import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Typed Firestore interaction boundaries
 */

export interface WaitlistData {
  email: string;
  sourcePage: string;
}

export interface PartnerData {
  restaurantName: string;
  contactEmail: string;
  yourName?: string;
  city?: string;
  tables?: string;
  about?: string;
  phone?: string;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submits a new sign-up to the waitlist_signups collection
 * Enforces schema: email, source_page, status (default: 'pending'), signed_up_at
 */
export const submitWaitlistSignup = async (data: WaitlistData) => {
  const colRef = collection(db, "waitlist_signups");
  return addDoc(colRef, {
    email: data.email,
    source_page: data.sourcePage,
    status: "pending",
    signed_up_at: serverTimestamp(),
  });
};

/**
 * Submits a request to the partner_requests collection
 * Enforces schema: restaurant_name, contact_email, phone (optional), status (default: 'new'), submitted_at
 */
export const submitPartnerRequest = async (data: PartnerData) => {
  const colRef = collection(db, "partner_requests");
  return addDoc(colRef, {
    restaurant_name: data.restaurantName,
    contact_email: data.contactEmail,
    your_name: data.yourName || "",
    city: data.city || "",
    tables: data.tables || "",
    about: data.about || "",
    phone: data.phone || "",
    status: "new",
    submitted_at: serverTimestamp(),
  });
};

/**
 * Submits a contact form message to the contact_messages collection
 * Enforces schema: name, email, subject, message, read, submitted_at
 */
export const submitContactMessage = async (data: ContactData) => {
  const colRef = collection(db, "contact_messages");
  return addDoc(colRef, {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    read: false,
    submitted_at: serverTimestamp(),
  });
};
