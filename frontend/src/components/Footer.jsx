import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative overflow-hidden bg-zinc-950 border-t border-white/10 pt-20 pb-8 px-4 md:px-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-teal-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                MY<span className="text-teal-400">WA</span>
              </h2>
              <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-widest">
                Munsyari Youth Welfare Association
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Empowering the youth through education, libraries, and community
              building. Shaping disciplined minds for a brighter future.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all">
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all">
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {["About", "Gallery", "Achievements", "Contact"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-zinc-400 hover:text-teal-400 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-teal-400 transition-colors" />
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </motion.div>

          {/* Column 3: Contact Details (Branches) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="flex flex-col gap-4">
              {/* Branch 1 */}
              <div className="flex items-start gap-3">
                <a
                  href="https://www.google.com/maps/place/Gyaan+Kumbh+Library/@30.3305422,78.0586874,19.5z/data=!4m6!3m5!1s0x390929279d99accd:0x9f148602c1a52b58!8m2!3d30.3304429!4d78.058886!16s%2Fg%2F11h97z77mb?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      Dehradun Branch
                    </span>
                    <span className="text-xs text-zinc-400">
                      1 Negi road near DBS(pg) college karnpur, Dehradun, UK
                    </span>
                  </div>
                </a>
              </div>
              {/* Branch 2 */}
              <div className="flex items-start gap-3">
                <a href="" className="flex items-start gap-3">
                  <MapPin size={18} className="text-lime-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      Haldwani Branch
                    </span>
                    <span className="text-xs text-zinc-400">
                      456 Knowledge Park, Haldwani, UK
                    </span>
                  </div>
                </a>
              </div>
              {/* Phone & Email */}
              <div className="flex items-center gap-3 pt-2">
                <Phone size={18} className="text-zinc-400 shrink-0" />
                <span className="text-sm text-zinc-400">+91 98765 43210</span>
              </div>
              <a href="mailto:support.mywa@gmail.com">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-zinc-400 shrink-0" />
                  <span className="text-sm text-zinc-400">
                    support.mywa@gmail.com
                  </span>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Column 4: Newsletter / Join */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-sm text-zinc-400">
              Subscribe to our newsletter to get the latest updates on events
              and achievements.
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md bg-linear-to-r from-teal-500 to-lime-500 text-black hover:scale-105 transition-transform">
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 text-center md:text-left">
            © {currentYear} Munsyari Youth Welfare Association. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-zinc-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-zinc-500 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>

        {/* created by */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full text-zinc-500 pt-8 flex items-center justify-center  ">
          <h1 className="text-xs flex items-center gap-1">
            website created with ❤️ by
            <a
              href="https://www.instagram.com/munna.rawat26"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 font-medium transition-colors duration-300 hover:text-teal-400 hover:underline underline-offset-4">
              Manoj Singh Rawat
            </a>
          </h1>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
