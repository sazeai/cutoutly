import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { UseCasesSection } from "@/components/use-cases-section"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start bg-gradient-to-br from-primary-light via-white to-secondary-light overflow-hidden relative pt-32 md:pt-36">
      {/* Cool Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-40 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-light opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-accent-light opacity-40 blur-3xl"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-1/4 text-5xl opacity-10">✨</div>
        <div className="absolute bottom-40 left-1/4 text-5xl opacity-10">🎨</div>
        <div className="absolute top-1/3 right-20 text-5xl opacity-10">💫</div>
      </div>

      <Header />

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto z-10 px-4 min-h-[calc(100vh-8rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full py-8">
          {/* Left Column */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Badge - smaller on desktop, centered on mobile */}
            <div className="flex justify-center lg:justify-start">
              <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 border-2 border-black rounded-full bg-white flex items-center space-x-1 md:space-x-2 shadow-[3px_3px_0_rgba(0,0,0,1)] text-sm md:text-base">
                <span className="text-lg md:text-xl">✨</span>
                <span className="font-bold">Cutoutly</span>
                <span className="text-lg md:text-xl">🎨</span>
              </div>
            </div>

            {/* Main Headline - smaller on mobile */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Turn your photo into a powerful, fun cartoon cutout
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-comic mt-2">
                — ready to drop into your pitch deck, landing page, or next big launch.
              </div>
            </div>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-700">
              Upload a selfie, pick a pose, add a speech bubble, and boom — you've got a transparent PNG of yourself (or
              your team) that stands out and sells.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                href="/create"
                className="px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_6px_0_rgba(0,0,0,1)] transform hover:translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,1)] transition-all inline-block"
              >
                Make My Cartoon Now →
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="mt-6 lg:mt-0">
            <div className="border-2 border-black rounded-3xl bg-white p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,1)]">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6">What It Does</h2>

              {/* What It Does Explainer */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">🖼</div>
                  <p className="text-base md:text-lg">Upload your face — or use a demo image</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">💡</div>
                  <p className="text-base md:text-lg">Choose a pose, prop, and mood</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">💬</div>
                  <p className="text-base md:text-lg">Add your message or call-to-action</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">🎯</div>
                  <p className="text-base md:text-lg">
                    Download as a transparent PNG — perfect for websites, decks, launches, and more
                  </p>
                </div>
              </div>

              {/* Before/After Images */}
              <div className="flex items-center justify-center my-6 md:my-8">
                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-black">
                  <Image
                    src="/diverse-group-selfie.png"
                    alt="Original selfie"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mx-2 md:mx-4 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-black">
                  <Image
                    src="/comic-strip-person.png"
                    alt="Cartoon cutout result"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Try it now button */}
              <div className="flex justify-center">
                <Link
                  href="/create"
                  className="w-full relative px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_6px_0_rgba(0,0,0,1)] transform hover:translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,1)] transition-all text-center"
                >
                  Make My Cartoon Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
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

      {/* Use Cases Section - Now using the new component */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <UseCasesSection />
      </div>

      {/* Social Proof Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="border-2 border-black rounded-xl bg-white p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,1)]">
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

      {/* Final CTA Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 mb-16 z-10 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Your face is your brand — let's cartoon it.</h2>
        <p className="text-xl mb-8">Make a PNG cutout that sells your product without saying a word.</p>
        <Link
          href="/create"
          className="px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_6px_0_rgba(0,0,0,1)] transform hover:translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,1)] transition-all inline-block"
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
