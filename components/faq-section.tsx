"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does the AI cartoon generator work?",
    answer:
      "Our AI analyzes your uploaded photo to identify facial features and expressions, then generates a cartoon version while maintaining your unique characteristics. The process takes just a few seconds and produces high-quality transparent PNG files.",
  },
  {
    question: "What file formats do you support for upload and download?",
    answer:
      "You can upload JPG, PNG, or WEBP files. All generated cartoons are provided as high-resolution transparent PNG files, perfect for use in presentations, websites, and marketing materials.",
  },
  {
    question: "Can I create cartoon cutouts for my entire team?",
    answer:
      "Yes! Cutoutly supports both individual and team cartoon generation. You can upload multiple photos at once or create consistent cartoon styles for your entire team to maintain brand consistency.",
  },
  {
    question: "Is my photo data safe and private?",
    answer:
      "Absolutely. We prioritize your privacy - uploaded photos are processed securely and automatically deleted after generation. We never store, share, or use your photos for any other purpose.",
  },
  {
    question: "What makes Cutoutly different from other cartoon generators?",
    answer:
      "Cutoutly is specifically designed for creators and businesses. We focus on professional-quality transparent PNGs, business-ready templates, and styles that work great for marketing, presentations, and social media.",
  },
  {
    question: "Can I customize the cartoon style and poses?",
    answer:
      "Yes! Choose from various cartoon styles, poses, expressions, and add custom speech bubbles or text. Our templates are designed for specific use cases like pitch decks, social media posts, and marketing materials.",
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not completely satisfied with your cartoon cutouts, contact our support team for a full refund.",
  },
  {
    question: "Can I use the cartoons for commercial purposes?",
    answer:
      "Yes! All generated cartoon cutouts come with full commercial usage rights. Use them in your business presentations, marketing materials, websites, and social media without any restrictions.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about creating cartoon cutouts with Cutoutly
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-2 border-black rounded-xl bg-white shadow-[2px_2px_0_rgba(0,0,0,1)] overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 flex-shrink-0" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <a
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          Contact Support
        </a>
      </div>
    </section>
  )
}
