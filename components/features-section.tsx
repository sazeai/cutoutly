import { Zap, Download, Palette, Users, Clock, Shield } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description: "Advanced AI technology creates professional cartoon cutouts from any photo in seconds",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Download,
    title: "Transparent PNG Export",
    description: "Download high-quality transparent PNGs ready for any background or design project",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Palette,
    title: "Customizable Styles",
    description: "Choose from multiple cartoon styles, poses, expressions, and speech bubbles",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Team & Group Support",
    description: "Create cartoon cutouts for entire teams or multiple people in one go",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "No waiting around - get your cartoon cutout generated and ready to download immediately",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Privacy Protected",
    description: "Your photos are processed securely and never stored or shared with third parties",
    color: "from-indigo-500 to-purple-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Creators</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to create professional cartoon cutouts that make your content stand out
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          return (
            <div
              key={index}
              className="group border-2 border-black rounded-xl bg-white p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
