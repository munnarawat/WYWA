import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, ArrowRight, UserPlus } from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About MYWA", to: "/about" },
  { label: "Think Tank", to: "/all-thinkTank" },
  { label: "Achievements", to: "/achievements" },
  { label: "Contact Us", to: "/contact" },
  { label: "Join the Family", to: "/Login" },
];

const BRANCHES = [
  {
    name: "Dehradun Branch",
    addr: "1 Negi Road, near DBS(PG) College, Karnpur, Dehradun, UK",
    href: "https://www.google.com/maps/place/Gyaan+Kumbh+Library/@30.3305422,78.0586874,19.5z",
    color: "teal", // teal-400 icon
  },
  {
    name: "Haldwani Branch",
    addr: "456 Knowledge Park, Haldwani, UK",
    href: "https://maps.app.goo.gl/yYoTExF71vbSwuAv6",
    color: "lime", // lime-400 icon
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const NavLink = ({ label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-[14px] text-slate-300 lg:text-slate-500 hover:text-teal-400 transition-colors duration-200 py-1.5 group">
    <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-teal-400 transition-colors duration-200 shrink-0" />
    {label}
  </Link>
);

const BranchCard = ({ name, addr, href, color }) => (
  <a
    href={href}
    target={href !== "#" ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="flex items-start gap-3 p-3 bg-white/2 border border-white/6 rounded-xl hover:border-teal-500/20 transition-colors duration-200 no-underline group">
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        color === "teal"
          ? "bg-teal-500/10 text-teal-400"
          : "bg-lime-500/10 text-lime-400"
      }`}>
      <MapPin size={15} />
    </div>
    <div>
      <div className="text-[13px] font-semibold text-slate-300 mb-0.5 group-hover:text-white transition-colors">
        {name}
      </div>
      <div className="text-[11.5px] text-slate-600 leading-relaxed">{addr}</div>
    </div>
  </a>
);

const SocialBtn = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    aria-label={label}
    className="w-9 h-9 rounded-full bg-white/4 border border-white/8 flex items-center justify-center text-slate-600 hover:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-200">
    <Icon size={17} />
  </a>
);

// ── Main Footer ──────────────────────────────────────────────────────────────

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-[#070C18] text-white">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,1) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-125 h-50 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(20,184,166,0.1) 0%,transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 -right-16 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)",
        }}
      />

      {/* ── CTA Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative text-center px-6 py-14 border-b border-white/5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500/8 border border-teal-500/20 rounded-full px-4 py-1.5 font-mono text-[10px] tracking-[0.14em] text-teal-300 uppercase mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          मुनस्यारी से · Est. 2022
        </div>

        {/* Eyebrow */}
        <div className="font-mono text-[11px] tracking-widest text-slate-600 uppercase mb-2.5">
          Join the Movement
        </div>

        {/* Heading */}
        <h2 className="text-[clamp(26px,5vw,44px)]  font-bold text-slate-100 leading-[1.15] tracking-tight mb-2">
          Join the{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#14b8a6,#84cc16)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            MYWA
          </span>{" "}
          Family
        </h2>

        {/* Hindi subheading */}
        <p
          className="text-[clamp(18px,3vw,30px)] font-bold mb-4 leading-snug"
          style={{
            fontFamily: "'Tiro Devanagari Hindi', serif",
            background: "linear-gradient(135deg,#14b8a6,#84cc16)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          एक विचार से एक परिवार तक की यात्रा
        </p>

        {/* CTA Button */}
        <Link
          to="/Login"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[14px] text-[14px] font-bold text-[#042F2E] no-underline transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg,#14b8a6,#84cc16)",
            boxShadow: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 10px 28px rgba(20,184,166,0.22)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
          <UserPlus size={16} />
          Join Our Community
          <ArrowRight size={15} />
        </Link>
      </motion.div>

      {/* ── 3-Column Grid ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-8 py-12">
        {/* Col 1: Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col">
          {/* Logo */}
          <div className="flex items-baseline mb-1">
            <span className="text-[28px] font-bold text-slate-100 tracking-tight leading-none">
              MY
            </span>
            <span className="text-[28px] font-bold text-teal-400 tracking-tight leading-none">
              WA
            </span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.12em] text-slate-600 uppercase mb-0.5">
            Munsyari Youth Welfare Association
          </div>
          <div className="font-mono text-[10px] text-slate-600 mb-5">
            since 2022
          </div>

          <p
            className="text-[13.5px] text-slate-600 leading-[1.8] mb-6"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            MYWA केवल एक संस्था नहीं, बल्कि शिक्षा, सहयोग और सेवा की भावना से
            जुड़ा एक परिवार है।
          </p>
          {/* Social Media Links */}
          <div className="flex items-center gap-2">
            {/* Dehradun */}
            <a
              href="https://www.instagram.com/mywadehradun"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MYWA Dehradun Instagram"
              className="group flex items-center gap-2.5 rounded-xl border border-pink-500/30 lg:border-white/10 bg-white/5 px-3 py-2 transition-all duration-300 hover:border-pink-500/30 hover:bg-white/10 hover:-translate-y-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-pink-500/10">
                <Instagram
                  size={17}
                  className="text-pink-400 lg:text-slate-400 transition-colors duration-300 lg:group-hover:text-pink-400"
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Instagram
                </span>
                <span className="mt-1 text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
                  Dehradun
                </span>
              </div>
            </a>

            {/* Haldwani */}
            <a
              href="https://www.instagram.com/mywa_haldwani"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MYWA Haldwani Instagram"
              className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-all duration-300 hover:border-pink-500/30 hover:bg-white/10 hover:-translate-y-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-pink-500/10">
                <Instagram
                  size={17}
                  className="text-pink-400 lg:text-slate-400 transition-colors duration-300 lg:group-hover:text-pink-400"
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Instagram
                </span>
                <span className="mt-1 text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
                  Haldwani
                </span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Col 2: Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="font-mono text-[11px] tracking-[0.12em] text-slate-500 uppercase mb-4">
            Quick Links
          </div>
          <div className="flex flex-col">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} {...l} />
            ))}
          </div>
        </motion.div>

        {/* Col 3: Branches + Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="font-mono text-[11px] tracking-[0.12em] text-slate-500 uppercase mb-4">
            Our Branches
          </div>
          <div className="flex flex-col gap-3 mb-4">
            {BRANCHES.map((b) => (
              <BranchCard key={b.name} {...b} />
            ))}
          </div>
          <a
            href="mailto:support.mywa@gmail.com"
            className="flex items-center gap-2.5 text-[13px] text-slate-600 hover:text-teal-400 transition-colors duration-200 py-1.5 no-underline">
            <Mail size={15} className="shrink-0" />
            support.mywa@gmail.com
          </a>
        </motion.div>
      </div>

      {/* ── Divider ── */}
      <div
        className="mx-8"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.06) 20%,rgba(255,255,255,0.06) 80%,transparent)",
        }}
      />

      {/* ── Bottom Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-5">
        <p className="font-mono text-[13px] text-center text-slate-500 tracking-[0.04em]">
          © {currentYear} Munsyari Youth Welfare Association. All rights
          reserved.
        </p>
        <p className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
          Website crafted with{" "}
          <span className="text-rose-500 text-[13px]">♥</span> by{" "}
          <a
            href="https://www.instagram.com/munna.rawat26"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 font-medium hover:text-teal-400 transition-colors duration-200 border-b border-transparent hover:border-teal-400 no-underline">
            Manoj Singh Rawat
          </a>
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
