import { Heart, ShieldCheck, Server, Sparkles, Smartphone, Copy, Users } from "lucide-react";
import Image from "next/image";
import connectToDatabase from "@/lib/mongodb";
import Donor from "@/models/Donor";

import DonateButton from "@/components/DonateButton";

export const dynamic = "force-dynamic";

async function getDonors() {
  await connectToDatabase();
  const donors = await Donor.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(donors));
}

export default async function DonatePage() {
  const bkashNumber = process.env.BKASH_UPAY_NUMBER || "01403926676";
  const donors = await getDonors();

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20 pb-24">
      {/* Premium Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-4 lg:pt-8 pb-12 lg:pb-16">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary mb-8 border border-primary/10">
            <Heart size={14} className="fill-primary/20" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Support The Dharma</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 tracking-tight leading-tight">
            Help Us Preserve <br className="hidden md:block" />
            <span className="italic text-gray-500">Sacred Teachings</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 font-serif leading-relaxed">
            Your generous contributions are directly used to maintain, update, and improve this website. 
            With your support, we can keep these profound teachings accessible, ad-free, and free for everyone worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          
          {/* Why Donate Section */}
          <div className="lg:col-span-2 space-y-10 lg:pr-8">
            <div>
              <h3 className="text-2xl font-serif text-gray-900 mb-8">Where your donation goes</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-primary">
                    <Server size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Server & Hosting</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Keeping the digital library online 24/7 with fast load times and reliable uptime.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-primary">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Website Updates</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Continuous development of new features, better UI, and adding more books to the archive.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Ad-Free Experience</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Ensuring a distraction-free, peaceful reading environment without intrusive advertisements.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-serif text-gray-900 mb-2">Get in touch</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you have any questions, suggestions, or would like to contact me directly, please feel free to reach out.
              </p>
              <a href="mailto:jbhe382@gmail.com" className="inline-flex items-center gap-2 text-primary font-bold hover:text-emerald-700 transition-colors">
                jbhe382@gmail.com
              </a>
            </div>
          </div>

          {/* Action Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center">
              
              <div className="mb-10">
                <h3 className="text-3xl font-serif text-gray-900 mb-4">Make a Contribution</h3>
                <p className="text-gray-500 text-lg">Click the button below to see the payment details and submit your donation information securely.</p>
              </div>

              <DonateButton bkashNumber={bkashNumber} />

              <div className="mt-12 pt-10 border-t border-gray-100 w-full">
                <p className="text-gray-500 font-serif italic text-lg">
                  "The gift of Dhamma excels all other gifts."
                </p>
                <p className="text-sm text-gray-400 mt-2">— Dhammapada 354</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Donors List Section */}
      {donors.length > 0 && (
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Our Kind Supporters
            </h2>
            <p className="text-gray-500 font-serif italic max-w-2xl">
              We extend our deepest gratitude to the generous individuals who have supported this project.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {donors.map((donor: any) => (
                <div 
                  key={donor._id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Heart size={16} className="fill-primary/20" />
                    </div>
                    <span className="font-serif text-lg font-bold text-gray-900">{donor.name}</span>
                  </div>
                  <span className="font-sans font-medium text-primary bg-primary/5 px-4 py-1.5 rounded-full text-sm">
                    {donor.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
