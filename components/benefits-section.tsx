import { TrendingUp, Heart, Sparkles, Target } from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    title: "Boost Engagement",
    description: "Cartoon cutouts get 3x more engagement than regular photos on social media",
    stat: "300%",
    statLabel: "More Engagement",
  },
  {
    icon: Heart,
    title: "Build Personal Brand",
    description: "Stand out from the crowd with unique, memorable visual content that represents you",
    stat: "10x",
    statLabel: "More Memorable",
  },
  {
    icon: Sparkles,
    title: "Professional Quality",
    description: "High-resolution outputs perfect for presentations, websites, and marketing materials",
    stat: "4K",
    statLabel: "Resolution",
  },
  {
    icon: Target,
    title: "Versatile Usage",
    description: "Use across all platforms - from LinkedIn posts to Product Hunt launches",
    stat: "50+",
    statLabel: "Use Cases",
  },
]

export function BenefitsSection() {
  return (
    <section className="w-full py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Creators Love Cutoutly</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of creators who use cartoon cutouts to make their content more engaging and memorable
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon
          return (
            <div
              key={index}
              className="text-center border-2 border-black rounded-xl bg-white p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {benefit.stat}
                </div>
                <div className="text-sm text-gray-600 font-medium">{benefit.statLabel}</div>
              </div>

              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
