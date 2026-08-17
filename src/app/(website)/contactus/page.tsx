"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Send,
  RefreshCw,
  ChevronDown,
  BookOpen,
  Rss,
  Globe2,
  Contact,
} from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 lg:py-20 text-[#1e1b18]">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-[#775a19] uppercase tracking-widest text-xs px-3 py-1 bg-[#fed488]/40 rounded-full inline-block mb-3 font-medium">
            Get In Touch
          </span>
          <h1 className="text-[28px] sm:text-[32px] md:text-[44px] leading-[1.2] md:leading-[1.2] tracking-[-0.01em] md:tracking-[-0.02em] font-bold text-[#570013] font-['Playfair_Display',serif] mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="font-sans text-lg text-[#584141] max-w-3xl mx-auto italic leading-relaxed">
            We welcome writers, poets, artists, performers, publishers,
            researchers, readers, cultural enthusiasts, institutions, and
            organisations to connect with us.
          </p>
          <div className="mt-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#8c7071] to-transparent relative mx-auto w-48">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fff8f5] px-3 text-[#570013] text-lg">
                ❦
              </span>
            </div>
          </div>
        </div>

        {/* Purpose of Contact Badges Section */}
        <div className="mb-12 bg-[#fbf2ed] border border-[#775a19]/20 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="text-[#775a19] w-6 h-6" />
            <h2 className="font-serif text-2xl text-[#570013] text-center font-bold">
              Contact Us For
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto text-sm">
            {[
              "Membership enquiries",
              "Literary & cultural programmes",
              "Workshops & competitions",
              "Publication-related support",
              "Partnerships & collaborations",
              "Sponsorship opportunities",
              "Event participation",
              "General information",
            ].map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#fff8f5] rounded-xl border border-[#e0bfbf]/60 font-medium text-[#1e1b18] flex items-center gap-2 shadow-xs hover:border-[#775a19] transition-colors"
              >
                <CheckCircle2 className="text-[#775a19] w-4 h-4 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Send Us a Message Form Section */}
          <div className="lg:col-span-7 bg-white border border-[#e0bfbf]/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(87,0,19,0.08)]">
            <div className="mb-8 border-b border-[#e0bfbf]/50 pb-6">
              <div className="flex items-center gap-2 text-[#570013] mb-1">
                <Edit3 className="w-6 h-6" />
                <h2 className="font-serif text-2xl md:text-3xl font-bold">
                  Send Us a Message
                </h2>
              </div>
              <p className="font-sans text-sm md:text-base text-[#584141] leading-relaxed">
                Please complete the contact form with your details and message.
                Our team will respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="full-name"
                  className="block text-sm text-[#775a19] font-semibold"
                >
                  Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="full-name"
                    name="full_name"
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-[#fbf2ed]/50 border border-[#e0bfbf]/70 focus:border-[#570013] focus:bg-[#fff8f5] focus:ring-1 focus:ring-[#570013] rounded-xl px-4 py-3 text-sm text-[#1e1b18] transition-all placeholder:text-[#8c7071]/70 outline-none"
                  />
                </div>
              </div>

              {/* Phone Number & Email Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm text-[#775a19] font-semibold"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone-number"
                    name="phone_number"
                    placeholder="Enter your phone number"
                    className="w-full bg-[#fbf2ed]/50 border border-[#e0bfbf]/70 focus:border-[#570013] focus:bg-[#fff8f5] focus:ring-1 focus:ring-[#570013] rounded-xl px-4 py-3 text-sm text-[#1e1b18] transition-all placeholder:text-[#8c7071]/70 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email-address"
                    className="block text-sm text-[#775a19] font-semibold"
                  >
                    Email Address <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email-address"
                    name="email_address"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-[#fbf2ed]/50 border border-[#e0bfbf]/70 focus:border-[#570013] focus:bg-[#fff8f5] focus:ring-1 focus:ring-[#570013] rounded-xl px-4 py-3 text-sm text-[#1e1b18] transition-all placeholder:text-[#8c7071]/70 outline-none"
                  />
                </div>
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-1.5">
                <label
                  htmlFor="subject"
                  className="block text-sm text-[#775a19] font-semibold"
                >
                  Subject <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className="w-full bg-[#fbf2ed]/50 border border-[#e0bfbf]/70 focus:border-[#570013] focus:bg-[#fff8f5] focus:ring-1 focus:ring-[#570013] rounded-xl px-4 py-3 text-sm text-[#1e1b18] transition-all cursor-pointer appearance-none pr-10 outline-none"
                  >
                    <option value="" disabled className="text-[#584141]">
                      Select a subject for your enquiry
                    </option>
                    <option value="Membership Enquiries">Membership Enquiries</option>
                    <option value="Literary and Cultural Programmes">
                      Literary and Cultural Programmes
                    </option>
                    <option value="Workshops and Competitions">
                      Workshops and Competitions
                    </option>
                    <option value="Publication-Related Support">
                      Publication-Related Support
                    </option>
                    <option value="Partnerships and Collaborations">
                      Partnerships and Collaborations
                    </option>
                    <option value="Sponsorship Opportunities">
                      Sponsorship Opportunities
                    </option>
                    <option value="Event Participation">Event Participation</option>
                    <option value="General Information">General Information</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7071] pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-sm text-[#775a19] font-semibold"
                >
                  Message <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Type your message here..."
                  className="w-full bg-[#fbf2ed]/50 border border-[#e0bfbf]/70 focus:border-[#570013] focus:bg-[#fff8f5] focus:ring-1 focus:ring-[#570013] rounded-xl p-4 text-sm text-[#1e1b18] transition-all resize-none placeholder:text-[#8c7071]/70 outline-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-3 group text-white ${
                    isSuccess
                      ? "bg-green-800"
                      : isSubmitting
                      ? "bg-[#570013] opacity-80 pointer-events-none"
                      : "bg-[#570013] hover:bg-[#800020]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Message Sent</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="bg-[#fbf2ed] border border-[#e0bfbf]/80 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(87,0,19,0.08)]">
              <div className="border-b border-[#e0bfbf]/60 pb-6">
                <div className="flex items-center gap-2 text-[#570013] mb-1">
                  <Contact className="w-6 h-6" />
                  <h3 className="font-serif text-2xl font-bold">
                    Contact Information
                  </h3>
                </div>
                <p className="text-sm text-[#775a19] font-semibold">
                  Association of Bengal for Literature and Culture
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: "Address",
                    text: "Official Address",
                  },
                  { icon: Phone, title: "Phone", text: "Contact Number" },
                  {
                    icon: Mail,
                    title: "Email",
                    text: "Official Email Address",
                  },
                  {
                    icon: Globe,
                    title: "Website",
                    text: "Website Address",
                  },
                  {
                    icon: Clock,
                    title: "Office Hours",
                    text: "Office Days and Timings",
                  },
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-2 rounded-xl hover:bg-[#fff8f5]/50 transition-colors"
                    >
                      <div className="bg-[#fed488]/80 p-2.5 rounded-xl text-[#785a1a] shrink-0 shadow-xs">
                        <IconComponent className="w-[22px] h-[22px]" />
                      </div>
                      <div>
                        <h4 className="text-xs text-[#775a19] uppercase tracking-wider font-semibold">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[#584141] mt-0.5">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Socials Section */}
            <div className="bg-[#efe6e2]/60 p-6 rounded-2xl text-center space-y-4 border border-[#e0bfbf]/80 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(87,0,19,0.08)]">
              <h3 className="text-xs text-[#775a19] uppercase tracking-widest font-semibold">
                Official Social Media
              </h3>
              <p className="text-sm text-[#584141] leading-relaxed">
                Follow us on our official social media group/page for updates
                about upcoming programmes, publications, competitions, workshops,
                and cultural events.
              </p>
              <div className="flex justify-center gap-4 pt-1">
                {[Globe2, BookOpen, Rss].map((IconComponent, index) => (
                  <a
                    key={index}
                    className="p-3 text-[#570013] hover:text-[#ff828a] bg-[#fff8f5] hover:bg-[#fed488]/50 rounded-xl transition-all shadow-xs border border-[#e0bfbf]/40 active:scale-95"
                    href="#"
                    aria-label="Social Link"
                  >
                    <IconComponent className="w-[26px] h-[26px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}