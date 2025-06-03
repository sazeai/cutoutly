import Link from "next/link"
import { Header } from "@/components/header"
import { UseCasesSection } from "@/components/use-cases-section"
import { FeaturesSection } from "@/components/features-section"
import { FAQSection } from "@/components/faq-section"
import { BenefitsSection } from "@/components/benefits-section"
import { StunningHero } from "@/components/stunning-hero"
import { FeatureSections } from "@/components/feature-sections"

export default function Home() {
  return (
    <main className="flex relative flex-col items-center justify-start bg-gradient-to-br from-primary-light via-white to-secondary-light overflow-hidden relative pt-32 md:pt-36">
      {/* Cool Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>


      <Header />

      {/* Hero Section - COMPETITION WINNING DESIGN */}
      <div className="w-full max-w-7xl mx-auto z-10 px-4 min-h-screen flex items-center relative overflow-hidden">
        <StunningHero />
      </div>
      <div className="w-full max-w-7xl mx-auto z-10 px-4 min-h-screen flex items-center relative overflow-hidden">

      <FeatureSections />
      </div>


      {/* Who It's For Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Who It's For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Startup founders",
              description: "Put yourself in the pitch deck with character.",
              icon: "🚀",
            },
            {
              title: "SaaS makers",
              description: 'Add personality to your "hero section."',
              icon: "💻",
            },
            {
              title: "Indie hackers",
              description: "Make your launch tweet pop.",
              icon: "🛠️",
            },
            {
              title: "Course creators",
              description: "Add fun to your thumbnails and sales pages.",
              icon: "🎓",
            },
            {
              title: "Product Hunt launchers",
              description: 'Stand out with a cartoon avatar saying "Live Now on PH!"',
              icon: "🏹",
            },
            {
              title: "Newsletter writers",
              description: "Use expressive characters in issue intros or CTAs.",
              icon: "📧",
            },
            {
              title: "Figma lovers / designers",
              description: "Drag and drop characters as stickers or mascots.",
              icon: "🎨",
            },
            {
              title: "Social media teams",
              description: "Make fun promo visuals with faces + quotes.",
              icon: "📱",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border-2 border-black rounded-xl bg-white p-5 shadow-[5px_5px_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases Section - Redesigned */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <UseCasesSection />
      </div>

      {/* Features Section - New for SEO */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <FeaturesSection />
      </div>

      {/* Benefits Section - New for SEO */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <BenefitsSection />
      </div>

      {/* Social Proof Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="border-2 border-black rounded-xl bg-white p-6 md:p-8 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">What People Are Saying</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl italic mb-4">
                "Best $5 I've spent this week. My launch tweet got 2x more likes than usual!"
              </p>
              <p className="font-bold">— Future Happy Customer, Indie Founder</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - New for SEO */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <FAQSection />
      </div>

      {/* Final CTA Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 mb-16 z-10 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Your face is your brand — let's cartoon it.</h2>
        <p className="text-xl mb-8">Make a PNG cutout that sells your product without saying a word.</p>
        <Link
          href="/create"
          className="px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-xl shadow-[0_6px_0_rgba(0,0,0,1)] transform hover:translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,1)] transition-all inline-block"
        >
          Make My Cartoon →
        </Link>
      </div>

      {/* Stats Section */}
      <div className="text-center mt-8 md:mt-16 mb-16 space-y-2 z-10">
        <p className="text-lg md:text-xl">
          Join{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            1,000+
          </span>{" "}
          creators using Cutoutly
        </p>
        <p className="text-xl md:text-2xl">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            10,000+
          </span>{" "}
          cartoon cutouts already created
        </p>
      </div>
    </main>
  )
}
