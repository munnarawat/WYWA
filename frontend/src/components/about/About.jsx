import { motion } from "framer-motion";

// ── Reusable sub-components ───────

const TlDot = ({ special = false }) => (
  <div className="flex flex-col items-center shrink-0 pt-1">
    <div
      className={`rounded-full border-2 z-10 relative ${
        special
          ? "w-4.5 h-4.5 border-indigo-400 bg-indigo-500/15 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]"
          : "w-3.5 h-3.5 border-teal-400 bg-[#0d1829]"
      }`}
    />
  </div>
);

const TlTag = ({ children, indigo = false }) => (
  <div
    className={`inline-block font-mono text-[10px] tracking-[0.12em] uppercase rounded px-2 py-0.5 mb-2.5 border ${
      indigo
        ? "text-indigo-400 bg-indigo-500/8 border-indigo-500/15"
        : "text-teal-400 bg-teal-500/8 border-teal-500/15"
    }`}
  >
    {children}
  </div>
);

const TlText = ({ children }) => (
  <div className="text-[15px] md:text-[17px] text-slate-400 leading-loose">{children}</div>
);

const ParagraphBlock = ({ tag, tagIndigo, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay, ease: "easeOut" }}
    className="flex gap-7 items-start mb-12"
  >
    <TlDot special={tagIndigo} />
    <div className="flex-1 min-w-0">
      <TlTag indigo={tagIndigo}>{tag}</TlTag>
      <TlText>{children}</TlText>
    </div>
  </motion.div>
);

const StatItem = ({ num, label }) => (
  <div className="text-center">
    <div
      className="text-3xl font-bold leading-none mb-1"
      style={{
        background: "linear-gradient(135deg,#14b8a6,#6366f1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {num}
    </div>
    <div className="font-mono text-[11px] tracking-[0.07em] uppercase text-slate-600">{label}</div>
  </div>
);

const Pillar = ({ icon, label }) => (
  <div className="flex flex-col items-start gap-1.5 p-3.5 bg-white/[0.02] border border-white/6 rounded-xl">
    <i className={`ti ti-${icon} text-teal-400 text-lg`} aria-hidden="true" />
    <span className="text-[13px] font-semibold text-slate-200">{label}</span>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

const About = () => {
  return (
    <section
      id="about"
      className="relative py-22 px-6 md:px-12 lg:px-24 bg-[#070C18] text-white overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,1) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div
        className="absolute -top-28 -right-16 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(20,184,166,0.07) 0%,transparent 65%)" }}
      />
      <div
        className="absolute -bottom-16 -left-14 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)" }}
      />

      <div className="relative z-10 max-w-[860px] mx-auto">

        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-teal-500/8 border border-teal-500/20 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.15em] text-teal-300 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            हमारी कहानी · Est. 2022
          </div>
        </motion.div>

        {/* ── Main Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center "
        >
          <h2
            className="text-[clamp(26px,5vw,52px)] font-bold leading-[1.2] tracking-tight text-slate-100"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
          >
            एक विचार से
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#14b8a6,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              एक परिवार तक की यात्रा
            </span>
          </h2>
          <div
            className="w-16 h-0.75 rounded-full mx-auto mt-5"
            style={{ background: "linear-gradient(90deg,#14b8a6,#6366f1)" }}
          />
        </motion.div>

        {/* ── Opening Quote ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border-l-[3px] border-teal-400/50 pl-7 mb-16 bg-teal-500/3 rounded-r-xl py-5"
        >
          <span
            className="absolute -top-3 left-4 text-6xl leading-none text-teal-400/20 select-none"
          >
            "
          </span>
          <p
            className="text-[clamp(17px,2.5vw,22px)] italic text-slate-400 leading-[1.9]"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
          >
            "जब अपने घर से दूर कोई अपना मिल जाए,
            <br />
            तो सफ़र आसान हो जाता है।"
          </p>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1.5 top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(180deg,rgba(20,184,166,0.6) 0%,rgba(99,102,241,0.4) 60%,transparent 100%)",
            }}
          />

          {/* 1 — The Beginning */}
          <ParagraphBlock tag="The Beginning" delay={0}>
            उत्तराखण्ड के सीमांत क्षेत्र{" "}
            <span className="text-teal-400 font-semibold">मुनस्यारी</span> से हर वर्ष
            अनेक युवा अपने सपनों को लेकर देहरादून पहुँचते हैं। कोई उच्च शिक्षा के लिए,
            कोई प्रतियोगी परीक्षाओं की तैयारी के लिए, तो कोई अपने जीवन को नई दिशा देने
            के उद्देश्य से। लेकिन नए शहर में पहला कदम रखते ही — एडमिशन, कोचिंग, पीजी,
            पुस्तकालय — चुनौतियाँ एक साथ खड़ी हो जाती हैं।
          </ParagraphBlock>

          {/* 2 — Foundation */}
          <ParagraphBlock tag="08 जनवरी 2022" tagIndigo delay={0.05}>
            इन्हीं चुनौतियों को महसूस करते हुए{" "}
            <span className="text-indigo-300 font-medium">MYWA की स्थापना</span> की गई।
            उद्देश्य केवल सहायता करना नहीं, बल्कि हर युवा को एक ऐसा परिवार देना था —
            जहाँ हर परिस्थिति में सहयोग, मार्गदर्शन और अपनापन मिले।
          </ParagraphBlock>

          {/* Founders Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="ml-10 mb-12 p-7 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl relative overflow-hidden"
          >
            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)" }}
            />
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-indigo-400 uppercase mb-4">
              <i className="ti ti-users text-base" aria-hidden="true" />
              संस्थापक सदस्य
              <div className="flex-1 h-px bg-indigo-500/20 ml-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "श्री नरेन्द्र सिंह जंगपांगी", title: "IRS · मार्गदर्शक" },
                { name: "श्री ठाकुर सिंह मपवाल", title: "संस्थापक सदस्य" },
                { name: "श्री महेश धर्मशक्तू", title: "संस्थापक सदस्य" },
                { name: "श्री हेमंत मर्तोलिया", title: "संस्थापक सदस्य" },
              ].map((f) => (
                <div
                  key={f.name}
                  className="px-4 py-3 bg-indigo-500/6 border border-indigo-500/10 rounded-xl"
                >
                  <div
                    className="text-[15px] font-semibold text-indigo-200"
                    style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
                  >
                    {f.name}
                  </div>
                  <div className="font-mono text-[12px] text-indigo-500/70 mt-0.5">{f.title}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3 — Mission */}
          <ParagraphBlock tag="Mission" delay={0.1}>
            MYWA का लक्ष्य केवल एक संगठन बनाना नहीं — बल्कि ऐसा मंच तैयार करना था
            जहाँ युवाओं को हर छोटी-बड़ी आवश्यकता में सहयोग मिले।
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <Pillar icon="book" label="शिक्षा" />
              <Pillar icon="briefcase" label="करियर" />
              <Pillar icon="building-library" label="पुस्तकालय" />
              <Pillar icon="heart" label="रक्तदान" />
              <Pillar icon="home" label="आवास" />
              <Pillar icon="star" label="व्यक्तित्व" />
            </div>
          </ParagraphBlock>

          {/* 4 — Growth */}
          <ParagraphBlock tag="Growth" delay={0.1}>
            समय के साथ MYWA युवाओं के व्यक्तित्व विकास का केंद्र बन गया।
            पुस्तकालय, मोटिवेशनल फिल्में, प्रतियोगिताएँ, करियर गाइडेंस, पिकनिक और
            सामाजिक कार्यक्रम — हर माध्यम से युवाओं को सीखने और आगे बढ़ने के अवसर मिले।
          </ParagraphBlock>

          {/* 5 — Haldwani */}
          <ParagraphBlock tag="विस्तार · हल्द्वानी" tagIndigo delay={0.1}>
            MYWA के निरंतर प्रयासों को देखते हुए इसका विस्तार{" "}
            <span className="text-teal-400 font-semibold">हल्द्वानी</span> तक किया गया —
            ताकि कुमाऊँ क्षेत्र के और अधिक युवा इस परिवार का हिस्सा बन सकें।
          </ParagraphBlock>

          {/* 6 — Today */}
          <ParagraphBlock tag="Today" delay={0.1}>
            आज MYWA केवल एक संस्था नहीं, बल्कि{" "}
            <span className="text-teal-400 font-semibold">हजारों युवाओं का विश्वास</span> है।
            अनेक युवाओं का विभिन्न राजकीय सेवाओं में चयन इस बात का प्रमाण है कि
            सही मार्गदर्शन और सहयोग किसी भी सपने को वास्तविकता में बदल सकता है।
          </ParagraphBlock>
        </div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap justify-center gap-10 py-8 border-t border-white/5 mb-16"
        >
          <StatItem num="2022" label="Founded" />
          <StatItem num="2" label="City Branches" />
          <StatItem num="∞" label="Connections" />
          <StatItem
            num={<span style={{ fontFamily: "'Tiro Devanagari Hindi', serif", fontSize: 22, paddingTop: 4 }}>परिवार</span>}
            label="Always"
          />
        </motion.div>

        {/* ── Closing Quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative p-10 text-center border border-indigo-500/20 rounded-[20px] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(99,102,241,0.06) 0%,rgba(20,184,166,0.04) 100%)",
          }}
        >
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 rounded-[20px] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg,rgba(99,102,241,0.04),transparent 60%,rgba(20,184,166,0.04))",
            }}
          />
          <h3
            className="relative z-10 text-[clamp(18px,3vw,28px)] font-bold text-slate-100 leading-[1.8] tracking-tight"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
          >
            "जब एक युवा आगे बढ़ता है,
            <br />
            तो केवल उसका भविष्य नहीं,
            <br />
            पूरा समाज आगे बढ़ता है।"
          </h3>
          <p className="relative z-10 mt-5 font-mono text-[13px] text-slate-600 tracking-[0.06em]">
            — MYWA परिवार
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default About;