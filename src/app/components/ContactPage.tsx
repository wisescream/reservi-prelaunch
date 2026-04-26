import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Twitter, Target, Eye, Heart } from "lucide-react";
import { Navbar, PrimaryButton, Footer, Page } from "./shared";
import { toast } from "sonner";
import { triggerCursorSuccess } from "./cursor";
import { submitContactMessage } from "../../lib/firestore";
import { trackEvent } from "../../lib/analytics";
import { AliveValueCard, AliveContactRow } from "./alive";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function ContactPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      <Navbar current="contact" onNavigate={onNavigate} />
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 44, color: "#1A1A1A" }}>Get in touch</h2>
            <p style={{ color: "#555555", fontSize: 17 }} className="mt-4">We'd love to hear from you. Fill out the form or reach us directly.</p>
            <div className="mt-10 space-y-6">
              {[
                { icon: <Mail size={20} />, label: "Email", value: "reservifouders@gmail.com" },
                { icon: <Phone size={20} />, label: "Phone", value: "+212 784-115699" },
                { icon: <MapPin size={20} />, label: "Address", value: "Casablanca, Morocco" },
              ].map((c, i) => (
                <AliveContactRow key={c.label} icon={c.icon} label={c.label} value={c.value} index={i} />
              ))}
            </div>
            <div className="mt-10">
              <div style={{ fontWeight: 700, color: "#1A1A1A" }} className="mb-3">Follow us</div>
              <div className="flex gap-3">
                {[
                  { Ic: Instagram, href: "https://www.instagram.com/reservi_app?igsh=MWRra3kxeGR5Nm50ZA%3D%3D&utm_source=qr" },
                  { Ic: TikTokIcon, href: "https://www.tiktok.com/@reservi.io?_r=1&_t=ZS-95rjZzGYL4v" }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl border border-gray-200 hover:border-[#E8450A] hover:text-[#E8450A] text-[#555] grid place-items-center transition-colors"
                  >
                    <item.Ic size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = e.currentTarget as HTMLFormElement;
                const formData = new FormData(f);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const subject = formData.get("subject") as string;
                const message = formData.get("message") as string;

                if (!name || !email || !subject || !message) {
                  toast.error("Please fill in all fields");
                  return;
                }

                try {
                  await submitContactMessage({ name, email, subject, message });
                  trackEvent("cta_click", { action: "contact_form_submit", email });
                  toast.success("Message sent!", { description: "Our team will get back to you within 24 hours." });
                  triggerCursorSuccess();
                  f.reset();
                } catch (error) {
                  toast.error("Failed to send message. Please try again.");
                  console.error(error);
                }
              }}
              className="bg-[#F5F5F5] rounded-2xl p-8 space-y-4"
            >
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Name</label>
                <input name="name" required className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A]" placeholder="Your name" />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Email address</label>
                <input name="email" type="email" required className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A]" placeholder="you@example.com" />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Subject</label>
                <input name="subject" required className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A]" placeholder="How can we help?" />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1A1A1A" }}>Message</label>
                <textarea name="message" required rows={5} className="mt-1 w-full px-4 py-3 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#E8450A] resize-none" placeholder="Write your message..." />
              </div>
              <PrimaryButton full>Send Message</PrimaryButton>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: <Target size={24} />, title: "Our mission", desc: "Make reservations effortless." },
            { icon: <Eye size={24} />, title: "Our vision", desc: "Great meals one tap away." },
            { icon: <Heart size={24} />, title: "Our values", desc: "Hospitality at every table." },
          ].map((v, i) => (
            <AliveValueCard key={v.title} icon={v.icon} title={v.title} description={v.desc} index={i} />
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
