import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#91E1D1] text-white py-8 border-t-16 border-[#FFFFE4] z-30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="space-y-4">
            <Image
              src="/logo footer.svg"
              alt="ReCoil Logo"
              width={256}
              height={256}
              priority
            />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-2xl">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/#about" className="block hover:text-tertiary transition-colors">
                About us
              </Link>
              <Link href="/exchange" className="block hover:text-tertiary transition-colors">
                Eco Exchange
              </Link>
              <Link href="/community" className="block hover:text-tertiary transition-colors">
                Community
              </Link>
              <Link href="/chatbot" className="block hover:text-tertiary transition-colors">
                AI Chatbot
              </Link>
            </div>
          </div>

          {/* Developers */}
          <div>
            <h4 className="font-semibold mb-4 text-2xl">Developers</h4>
            <div className="space-y-2">
              <Link href="https://www.linkedin.com/in/tsabit-coda-rafisukmawan/" className="block hover:text-tertiary transition-colors" target="_blank">
                Code
              </Link>
              <Link href="https://www.linkedin.com/in/edbert-halim/" className="block hover:text-tertiary transition-colors" target="_blank">
                Edbert
              </Link>
              <Link href="https://www.daffafathoni.com/about" className="block hover:text-tertiary transition-colors" target="_blank">
                Dafton
              </Link>
              <Link href="https://georgina-elena-portofolio.framer.website/" className="block hover:text-tertiary transition-colors" target="_blank">
                Elena
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-2xl">Let&apos;s Connect</h4>
            <p className="text-sm mb-4">
              Feel free to reach out if you have any questions or would like to collaborate.
            </p>
            <Button className="bg-gradient-to-r to-[#04BB84] from-[#FFE51C] text-[#FFFECF] hover:bg-gradient-to-r hover:to-[#FFE51C] hover:from-[#FFFECF] text-[#FFFECF] hover:text-[#123524] text-xl px-4 py-2 rounded-lg">Contact Now</Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-sm text-white/80">© 2025 ReCoil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}