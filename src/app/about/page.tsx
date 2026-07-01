import Link from "next/link";
import { Globe } from "lucide-react";

export const metadata = {
  title: "About Us | Buddha Dharma Sutra",
  description: "Learn more about the creator behind Buddha Dharma Sutra.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col items-center text-center">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4">Behind the Project</span>
          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-6 tracking-tighter">About the Creator</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center md:items-start">

          {/* Image Section */}
          <div className="w-full md:w-5/12 shrink-0">
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto md:max-w-none rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 bg-gray-100">
              <img
                src="/about-me.png"
                alt="Joy Assroy Barua"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-7/12 flex flex-col justify-center pt-4 md:pt-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-2">Joy Assroy Barua</h2>
            <p className="text-xl text-primary font-medium mb-8">Full-Stack Developer</p>

            <div className="space-y-6 text-lg text-gray-600 font-serif leading-relaxed mb-10">
              <p>
                Hello! I am a passionate Full-Stack Developer with a deep interest in building meaningful and elegant digital experiences.
                I am currently pursuing my graduation in Computer Science and Engineering (CSE) from <strong>Daffodil International University</strong>.
              </p>
              <p>
                The <em>Buddha Dharma Sutra</em> project was born out of a desire to make the profound teachings of the Buddha accessible to everyone in a modern, distraction-free environment.
                I combined my technical skills with my devotion to create a platform that honors these sacred texts through minimalist and premium design.
              </p>
              <p>
                When I'm not coding or studying, I'm always exploring new technologies and working on side projects to solve real-world problems.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 items-center pt-6 border-t border-gray-100">
              <a
                href="https://joyassroy-barua.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-primary transition-colors shadow-sm"
              >
                <Globe size={18} />
                Visit Portfolio
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
