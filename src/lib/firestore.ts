import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
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
 * Helper to trigger automated confirmation emails via Vercel API
 */
const triggerConfirmationEmail = async (email: string, type: "waitlist" | "partner" | "contact") => {
  try {
    const response = await fetch("/api/send-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, type }),
    });
    if (!response.ok) {
      console.error("Failed to trigger confirmation email:", await response.text());
    }
  } catch (error) {
    console.error("Error triggering confirmation email:", error);
  }
};


/**
 * Submits a new sign-up to the waitlist_signups collection
 * Enforces schema: email, source_page, status (default: 'pending'), signed_up_at
 */
export const submitWaitlistSignup = async (data: WaitlistData) => {
  const colRef = collection(db, "waitlist_signups");
  
  const normalizedEmail = data.email.toLowerCase().trim();


  const docRef = await addDoc(colRef, {
    email: normalizedEmail,
    source_page: data.sourcePage,
    status: "pending",
    signed_up_at: serverTimestamp(),
  });
  
  // Trigger email confirmation in the background
  triggerConfirmationEmail(normalizedEmail, "waitlist");
  
  return docRef;
};

/**
 * Submits a request to the partner_requests collection
 * Enforces schema: restaurant_name, contact_email, phone (optional), status (default: 'new'), submitted_at
 */
export const submitPartnerRequest = async (data: PartnerData) => {
  const colRef = collection(db, "partner_requests");
  const docRef = await addDoc(colRef, {
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

  // Trigger email confirmation in the background
  triggerConfirmationEmail(data.contactEmail, "partner");

  return docRef;
};


/**
 * Submits a contact form message to the contact_messages collection
 * Enforces schema: name, email, subject, message, read, submitted_at
 */
export const submitContactMessage = async (data: ContactData) => {
  const colRef = collection(db, "contact_messages");
  const docRef = await addDoc(colRef, {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    read: false,
    submitted_at: serverTimestamp(),
  });

  // Trigger email confirmation in the background
  triggerConfirmationEmail(data.email, "contact");

  return docRef;
};

