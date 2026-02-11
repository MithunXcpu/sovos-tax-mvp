import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Sovos Tax Compliance Cloud",
  description: "Get in touch with the Sovos Tax Compliance team",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0F1A" }}>
      {/* Header */}
      <header
        className="border-b px-6 py-4"
        style={{ borderColor: "#374151", background: "#111827" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-medium transition-colors"
            style={{ color: "#9CA3AF" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#0066CC" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: "#F9FAFB" }}
            >
              Sovos Tax
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1
              className="text-3xl font-bold tracking-tight mb-3"
              style={{ color: "#F9FAFB", fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Get in Touch
            </h1>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              Have a question or want to work together? Drop me a line.
            </p>
          </div>

          {/* Contact Form */}
          <form
            action="https://formspree.io/f/xnjbjvng"
            method="POST"
            className="space-y-5"
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: "#F9FAFB" }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "#1F2937",
                  border: "1px solid #374151",
                  color: "#F9FAFB",
                }}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "#F9FAFB" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "#1F2937",
                  border: "1px solid #374151",
                  color: "#F9FAFB",
                }}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-2"
                style={{ color: "#F9FAFB" }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "#1F2937",
                  border: "1px solid #374151",
                  color: "#F9FAFB",
                }}
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
                style={{ color: "#F9FAFB" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project or question..."
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-vertical"
                style={{
                  background: "#1F2937",
                  border: "1px solid #374151",
                  color: "#F9FAFB",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-semibold tracking-wide transition-all"
              style={{
                background: "#0066CC",
                color: "#FFFFFF",
              }}
            >
              Send Message
            </button>
          </form>

          {/* Footer Credit */}
          <p
            className="text-center text-xs mt-10"
            style={{ color: "#6B7280" }}
          >
            Built by mithunsnottechnical
          </p>
        </div>
      </main>
    </div>
  );
}
