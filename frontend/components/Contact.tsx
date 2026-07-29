"use client";
import { FormEvent, useState, useEffect } from "react";
import { submitContact, getContactInfo } from "@/lib/api";
import { Send, Mail, MapPin, Calendar, Globe, GitBranch, ArrowRight, CheckCircle, AlertCircle, Phone, Camera, ExternalLink } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    getContactInfo().then(setContactInfo).catch(() => setContactInfo({
      phones: ["01770 340 226", "0151 895 1529"],
      emails: ["mondolmdalahe1880@gmail.com", "dwlaha9@gmail.com"],
      dob: "November 02, 1999",
      nationality: "Bangladeshi",
      socials: {
        instagram: "https://www.instagram.com/mdalahimondol",
        linkedin: "https://www.linkedin.com/in/md-alahi-914b13285",
        github: "https://github.com/mdalahimondol",
        email: "mailto:mondolmdalahe1880@gmail.com",
      }
    }));
  }, []);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setForm({ name: "", email: "", message: "" });
        setTouched({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const validate = () => {
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("Name is required");
    if (!form.email.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push("Invalid email format");
    if (!form.message.trim()) errors.push("Message is required");
    else if (form.message.trim().length < 10) errors.push("Message must be at least 10 characters");
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errors = validate();
    if (errors.length > 0) {
      setErrorMsg(errors[0]);
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await submitContact(form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const phones = contactInfo?.phones || ["01770 340 226", "0151 895 1529"];
  const emails = contactInfo?.emails || ["mondolmdalahe1880@gmail.com", "dwlaha9@gmail.com"];
  const dob = contactInfo?.dob || "November 02, 1999";
  const nationality = contactInfo?.nationality || "Bangladeshi";
  const socials = contactInfo?.socials || {};

  return (
    <section id="contact" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="section-container relative z-10">
        <div className="fade-in-up">
          <h2 className="section-title">Get in <span className="glow-text">Touch</span></h2>
          <p className="section-subtitle">Have a project in mind or want to discuss opportunities? Let&apos;s connect.</p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div className="fade-in-up space-y-6" style={{ transitionDelay: "100ms" }}>
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Contact Information</h3>
              <dl className="mt-5 space-y-4 text-sm text-slate-400">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-cyan-500 shrink-0" />
                  <div>
                    <dt className="font-medium text-slate-300">Phone</dt>
                    <dd className="mt-1 flex flex-col gap-1">
                      {phones.map((p: string) => (
                        <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="text-cyan-400 hover:underline">{p}</a>
                      ))}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-cyan-500 shrink-0" />
                  <div>
                    <dt className="font-medium text-slate-300">Email</dt>
                    <dd className="mt-1 flex flex-col gap-1">
                      {emails.map((e: string) => (
                        <a key={e} href={`mailto:${e}`} className="text-cyan-400 hover:underline">{e}</a>
                      ))}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-cyan-500 shrink-0" />
                  <div>
                    <dt className="font-medium text-slate-300">Date of Birth</dt>
                    <dd className="mt-1">{dob}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-5 w-5 text-cyan-500 shrink-0" />
                  <div>
                    <dt className="font-medium text-slate-300">Nationality</dt>
                    <dd className="mt-1">{nationality}</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6 flex gap-3">
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400" aria-label="Instagram">
                    <Camera className="h-5 w-5" />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400" aria-label="LinkedIn">
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400" aria-label="GitHub">
                    <GitBranch className="h-5 w-5" />
                  </a>
                )}
                {socials.email && (
                  <a href={socials.email} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400" aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="fade-in-up" style={{ transitionDelay: "200ms" }}>
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
                <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20" placeholder="Your name" />
                {touched.name && !form.name.trim() && <p className="mt-1 text-xs text-red-400">Name is required</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => setTouched({ ...touched, email: true })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20" placeholder="your@email.com" />
                {touched.email && !form.email.trim() && <p className="mt-1 text-xs text-red-400">Email is required</p>}
                {touched.email && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && <p className="mt-1 text-xs text-red-400">Invalid email format</p>}
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-300">Message</label>
                <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} onBlur={() => setTouched({ ...touched, message: true })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20" placeholder="Your message..." />
                {touched.message && form.message.trim().length < 10 && <p className="mt-1 text-xs text-red-400">Message must be at least 10 characters</p>}
              </div>
              <button type="submit" disabled={status === "loading"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
                {status === "loading" ? (<><Send className="h-4 w-4 animate-pulse" />Sending...</>) : status === "success" ? (<><CheckCircle className="h-4 w-4" />Message Sent!</>) : (<>Send Message<ArrowRight className="h-4 w-4" /></>)}
              </button>
              {status === "success" && (
                <div className="flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4 text-sm font-medium text-cyan-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>Message sent successfully! I&apos;ll get back to you soon.</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-medium text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}