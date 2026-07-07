import {
  IconBook,
  IconBriefcase,
  IconHeart,
  IconHome,
  IconLibrary,
  IconMapPin,
  IconMessage,
  IconMovie,
  IconSchool,
  IconSparkle,
  IconTargetArrow,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
    }`}>
    {children}
  </div>
);

const TlText = ({ children }) => (
  <div className="text-[15px] md:text-[17px] text-slate-400 leading-loose">
    {children}
  </div>
);

const ParagraphBlock = ({ tag, tagIndigo, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay, ease: "easeOut" }}
    className="flex gap-7 items-start mb-12">
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
      }}>
      {num}
    </div>
    <div className="font-mono text-[11px] tracking-[0.07em] uppercase text-slate-600">
      {label}
    </div>
  </div>
);

const Pillar = ({ icon, label }) => (
  <div className="flex flex-col items-start gap-1.5 p-3.5 bg-white/[0.02] border border-white/6 rounded-xl">
    <div className="text-teal-400">{icon}</div>
    <span className="text-[13px] font-semibold text-slate-200">{label}</span>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

const About = () => {
  return (
    <section
      id="about"
      className="relative py-22 px-6 md:px-12 lg:px-24 bg-[#070C18] text-white overflow-hidden">
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
        style={{
          background:
            "radial-gradient(circle,rgba(20,184,166,0.07) 0%,transparent 65%)",
        }}
      />
      <div
        className="absolute -bottom-16 -left-14 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-[860px] mx-auto">
        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6">
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
          className="text-center ">
          <h2
            className="text-[clamp(26px,5vw,52px)] font-bold leading-[1.2] tracking-tight text-slate-100"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            एक विचार से
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#14b8a6,#6366f1)",
                WebkitBackgroundClip: "text",
                padding: "10px",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
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
          className="relative border-l-[3px] border-teal-400/50 pl-7 mb-16 bg-teal-500/3 rounded-r-xl py-5">
          <span className="absolute -top-3 left-4 text-6xl leading-none text-teal-400/20 select-none">
            "
          </span>
          <p
            className="text-[clamp(17px,2.5vw,22px)] italic text-slate-400 leading-[1.9]"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
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
            <>
              <p>
                उत्तराखण्ड के सीमांत क्षेत्र{" "}
                <span className="text-teal-400 font-semibold">मुनस्यारी</span>
                अपनी प्राकृतिक सुंदरता, संस्कृति और प्रतिभाशाली युवाओं के लिए
                जाना जाता है। हर वर्ष यहाँ से अनेक छात्र-छात्राएँ उच्च शिक्षा,
                प्रतियोगी परीक्षाओं की तैयारी और बेहतर भविष्य की तलाश में
                देहरादून का रुख करते हैं। अपने सपनों को साकार करने की इस यात्रा
                में वे अपने घर, परिवार और परिचित वातावरण को पीछे छोड़कर एक नए
                शहर में जीवन की शुरुआत करते हैं।
              </p>

              <br />

              <p>
                लेकिन नए शहर में कदम रखते ही उनके सामने अनेक चुनौतियाँ खड़ी हो
                जाती हैं। सही कॉलेज में प्रवेश लेना, उपयुक्त कोचिंग का चयन करना,
                रहने के लिए सुरक्षित पीजी या कमरा ढूँढना, पुस्तकालय की सुविधा
                प्राप्त करना तथा नए वातावरण में स्वयं को स्थापित करना—ये सभी
                कठिनाइयाँ लगभग हर विद्यार्थी के सामने आती थीं। कई बार स्वास्थ्य
                सम्बन्धी आकस्मिक परिस्थितियों में रक्तदान या अन्य आवश्यक सहयोग
                की आवश्यकता भी महसूस होती थी।
              </p>

              <br />

              <p>
                इन्हीं अनुभवों ने एक ऐसे विचार को जन्म दिया कि यदि सभी युवा एक
                परिवार की तरह संगठित होकर एक-दूसरे का सहयोग करें, तो हर चुनौती
                का समाधान आसान हो सकता है। इसी सोच ने आगे चलकर एक ऐसे संगठन की
                नींव रखी, जिसका उद्देश्य केवल सहायता प्रदान करना नहीं, बल्कि
                युवाओं के बीच विश्वास, सहयोग और अपनापन का एक मजबूत नेटवर्क तैयार
                करना था।
              </p>
            </>
          </ParagraphBlock>

          {/* 2 — Foundation */}
          <ParagraphBlock tag="08 जनवरी 2022" tagIndigo delay={0.05}>
            <>
              <p>
                <span className="text-indigo-300 font-semibold">
                  08 जनवरी 2022
                </span>{" "}
                केवल एक तारीख नहीं, बल्कि MYWA की यात्रा का वह ऐतिहासिक दिन है
                जब एक साझा विचार ने संगठित रूप लेना शुरू किया। इसी दिन देहरादून
                में अध्ययनरत एवं विभिन्न प्रतियोगी परीक्षाओं की तैयारी कर रहे
                मुनस्यारी क्षेत्र के युवाओं को एक मंच पर लाने के उद्देश्य से
                पहली बैठक आयोजित की गई।
              </p>

              <br />

              <p>
                इस बैठक का उद्देश्य केवल एक संगठन बनाना नहीं था, बल्कि ऐसा
                परिवार तैयार करना था जहाँ हर युवा अपनी समस्याओं को खुलकर साझा कर
                सके और उसे समय पर सही मार्गदर्शन एवं सहयोग प्राप्त हो। विचार यह
                था कि मुनस्यारी से आने वाला कोई भी विद्यार्थी नए शहर में स्वयं
                को अकेला महसूस न करे।
              </p>

              <br />

              <p>
                इस पहल को दिशा और प्रेरणा प्रदान की
                <span className="text-teal-400 font-semibold">
                  {" "}
                  श्री नरेन्द्र सिंह जंगपांगी (IRS)
                </span>
                जी ने। उनके मार्गदर्शन और वरिष्ठ सदस्यों के सहयोग से MYWA की
                मजबूत नींव रखी गई। शुरुआत से ही यह स्पष्ट था कि यह संगठन केवल
                वर्तमान की समस्याओं का समाधान नहीं करेगा, बल्कि आने वाले वर्षों
                में युवाओं के लिए अवसर, मार्गदर्शन और सहयोग का एक स्थायी मंच
                बनेगा।
              </p>
            </>
          </ParagraphBlock>

          {/* Founders Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="ml-10 mb-12 p-7 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl relative overflow-hidden">
            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)",
              }}
            />
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-indigo-400 uppercase mb-4">
              <i className="ti ti-users text-base" aria-hidden="true" />
              संस्थापक सदस्य
              <div className="flex-1 h-px bg-indigo-500/20 ml-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "श्री नरेन्द्र सिंह जंगपांगी",
                  title: "IRS • प्रेरणास्रोत एवं मार्गदर्शक",
                },
                {
                  name: "श्री ठाकुर सिंह मपवाल",
                  title: "IRS • संस्थापक सदस्य",
                },
                {
                  name: "श्री महेश धर्मशक्तू",
                  title: "समीक्षा अधिकारी • संस्थापक सदस्य",
                },
                { name: "श्री हेमंत मर्तोलिया", title: "संस्थापक सदस्य" },
                {
                  name: "श्री धर्मेन्द्र सिंह मर्तोलिया",
                  title: "संस्थापक सदस्य",
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="px-4 py-3 bg-indigo-500/6 border border-indigo-500/10 rounded-xl">
                  <div
                    className="text-[15px] font-semibold text-indigo-200"
                    style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    {f.name}
                  </div>
                  <div className="font-mono text-[12px] text-indigo-500/70 mt-0.5">
                    {f.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3 — Mission & Purpose */}
          <ParagraphBlock tag="Mission & Purpose" delay={0.1}>
            <>
              <p>
                MYWA की स्थापना केवल एक संगठन बनाने के उद्देश्य से नहीं की गई
                थी, बल्कि एक ऐसे परिवार का निर्माण करने के लिए की गई थी जहाँ हर
                युवा को सही समय पर सही मार्गदर्शन, सहयोग और अपनापन मिल सके।
                संगठन का विश्वास शुरू से ही यह रहा है कि जब युवा एक-दूसरे के साथ
                खड़े होते हैं, तो कोई भी चुनौती बड़ी नहीं रहती।
              </p>

              <br />

              <p>
                देहरादून जैसे नए शहर में आने वाले विद्यार्थियों को अक्सर कॉलेज
                में प्रवेश, उपयुक्त कोचिंग संस्थान का चयन, पुस्तकालय की सुविधा,
                सुरक्षित पीजी अथवा रहने के लिए कमरा ढूँढने जैसी समस्याओं का
                सामना करना पड़ता है। MYWA ने इन सभी आवश्यकताओं को समझते हुए एक
                ऐसा सहयोगी नेटवर्क तैयार किया जहाँ अनुभवी सदस्य नए विद्यार्थियों
                का मार्गदर्शन करते हैं और उन्हें सही निर्णय लेने में सहायता
                प्रदान करते हैं।
              </p>

              <br />

              <p>
                संगठन केवल शिक्षा तक सीमित नहीं रहा। आवश्यकता पड़ने पर रक्तदान,
                स्वास्थ्य सम्बन्धी आकस्मिक सहायता, करियर मार्गदर्शन, प्रतियोगी
                परीक्षाओं की जानकारी, व्यक्तित्व विकास तथा युवाओं के बीच आपसी
                समन्वय को बढ़ावा देना भी MYWA के प्रमुख उद्देश्यों में शामिल रहा
                है। संगठन का प्रयास हमेशा यही रहा है कि प्रत्येक युवा स्वयं को
                इस परिवार का एक महत्वपूर्ण सदस्य महसूस करे।
              </p>

              <br />

              <p>
                MYWA का उद्देश्य केवल वर्तमान समस्याओं का समाधान करना नहीं,
                बल्कि युवाओं के भीतर नेतृत्व क्षमता, सामाजिक उत्तरदायित्व और
                सेवा की भावना विकसित करना भी है, ताकि वे स्वयं आगे बढ़ें और
                भविष्य में अन्य युवाओं के लिए प्रेरणा बन सकें।
              </p>
            </>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              <Pillar icon={<IconSchool size={22} />} label="कॉलेज एडमिशन" />

              <Pillar icon={<IconBook size={22} />} label="पुस्तकालय" />

              <Pillar icon={<IconHome size={22} />} label="पीजी / आवास" />

              <Pillar icon={<IconHeart size={22} />} label="रक्तदान सहायता" />

              <Pillar
                icon={<IconBriefcase size={22} />}
                label="करियर मार्गदर्शन"
              />

              <Pillar icon={<IconUsers size={22} />} label="युवा सहयोग" />

              <Pillar
                icon={<IconTargetArrow size={22} />}
                label="प्रतियोगी परीक्षाएँ"
              />

              <Pillar
                icon={<IconSparkle size={22} />}
                label="व्यक्तित्व विकास"
              />

              <Pillar icon={<IconMessage size={22} />} label="आपसी समन्वय" />
            </div>
          </ParagraphBlock>

          {/* 4- think-tank */}
          <ParagraphBlock tag="Think Tank" tagIndigo delay={0.1}>
            <>
              <p>
                किसी भी संस्था की वास्तविक शक्ति केवल उसके संसाधनों में नहीं,
                बल्कि उन लोगों में होती है जो निस्वार्थ भाव से उसके उद्देश्य को
                आगे बढ़ाते हैं। MYWA की सफलता के पीछे भी ऐसे ही अनुभवी
                मार्गदर्शकों, वरिष्ठ अधिकारियों और समर्पित सदस्यों का निरंतर
                सहयोग रहा है, जिन्होंने अपने अनुभव, समय और मार्गदर्शन से इस
                संगठन को मजबूत बनाया।
              </p>

              <br />

              <p>
                MYWA Think Tank ने शुरुआत से ही संगठन को सही दिशा देने का कार्य
                किया। वरिष्ठ सदस्यों ने युवाओं को केवल प्रतियोगी परीक्षाओं तक
                सीमित न रहने, बल्कि जीवन के प्रत्येक क्षेत्र में स्वयं को विकसित
                करने के लिए प्रेरित किया। उनका मानना रहा कि एक सफल युवा केवल
                अच्छी नौकरी पाने वाला व्यक्ति नहीं, बल्कि समाज के प्रति अपनी
                जिम्मेदारियों को समझने वाला जागरूक नागरिक भी होना चाहिए।
              </p>

              <br />

              <p>
                Think Tank के मार्गदर्शन में शिक्षा, व्यक्तित्व विकास, नेतृत्व
                क्षमता, सामाजिक उत्तरदायित्व, आपसी सहयोग तथा अनुशासन जैसे
                मूल्यों को संगठन की कार्यशैली का हिस्सा बनाया गया। यही कारण है
                कि MYWA केवल एक छात्र संगठन न रहकर युवाओं के समग्र विकास का एक
                सशक्त मंच बन गया।
              </p>

              <br />

              <p>
                संगठन के प्रत्येक कार्यक्रम, निर्णय और नई पहल के पीछे Think Tank
                के सदस्यों का निरंतर सहयोग और मार्गदर्शन रहा है। यही सामूहिक सोच
                और सेवा की भावना आज MYWA की सबसे बड़ी पहचान बन चुकी है।
              </p>
            </>
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {[
                {
                  name: "श्री नरेन्द्र सिंह जंगपांगी",
                  role: "IRS • प्रधान आयुक्त, आयकर विभाग",
                  contribution: "MYWA की स्थापना के लिए प्रेरणा एवं मार्गदर्शन",
                },
                {
                  name: "श्री ठाकुर सिंह मपवाल",
                  role: "IRS • अपर आयुक्त",
                  contribution: "संस्थापक सदस्य",
                },
                {
                  name: "श्री महेश धर्मशक्तू",
                  role: "समीक्षा अधिकारी",
                  contribution: "संस्थापक सदस्य",
                },
                {
                  name: "श्री हेमंत मर्तोलिया",
                  role: "संस्थापक सदस्य",
                  contribution:
                    "युवाओं के मार्गदर्शन एवं संगठन निर्माण में योगदान",
                },
                {
                  name: "श्री धर्मेन्द्र सिंह मर्तोलिया",
                  role: "संस्थापक सदस्य",
                  contribution: "युवाओं एवं Think Tank के बीच समन्वय",
                },
                {
                  name: "श्री नवराज पांगती",
                  role: "मार्गदर्शक",
                  contribution: "युवाओं के नेतृत्व एवं संगठन विस्तार में सहयोग",
                },
                {
                  name: "कैप्टन भूपेन्द्र सिंह पांगती",
                  role: "Merchant Navy",
                  contribution: "पुस्तकालय हेतु पुस्तकों का योगदान",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="px-4 py-3 bg-indigo-500/6 border border-indigo-500/10 rounded-xl">
                  <div
                    className="text-[15px] font-semibold text-indigo-200"
                    style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    {t.name}
                  </div>
                  <div className="text-[13px] text-indigo-300">{t.role}</div>
                  <div className="font-mono text-[12px] text-indigo-500/70 mt-0.5">
                    {t.contribution}
                  </div>
                </div>
              ))}
            </div>
          </ParagraphBlock>

          {/* 5 — Activities & Community*/}
          <ParagraphBlock tag="Activities & Community" delay={0.1}>
            <>
              <p>
                किसी भी संस्था की पहचान केवल उसके उद्देश्य से नहीं, बल्कि उसके
                कार्यों से होती है। स्थापना के बाद से ही MYWA ने युवाओं के लिए
                ऐसा वातावरण तैयार करने का प्रयास किया जहाँ शिक्षा, सहयोग और
                व्यक्तिगत विकास एक साथ आगे बढ़ सकें। संगठन का उद्देश्य केवल
                समस्याओं का समाधान करना नहीं, बल्कि युवाओं को सीखने, जुड़ने और
                आगे बढ़ने के लिए निरंतर अवसर उपलब्ध कराना रहा है।
              </p>

              <br />

              <p>
                पिछले कई वर्षों से MYWA द्वारा युवाओं के लिए पुस्तकालय की सुविधा
                उपलब्ध कराई जा रही है, जिससे अनेक विद्यार्थियों को शांत एवं
                सकारात्मक वातावरण में अध्ययन करने का अवसर मिला। इसके साथ-साथ
                समय-समय पर मोटिवेशनल फिल्म प्रदर्शन, करियर मार्गदर्शन सत्र,
                शैक्षणिक चर्चाएँ तथा विभिन्न प्रकार की प्रतियोगिताओं का आयोजन
                किया गया, ताकि विद्यार्थियों के भीतर आत्मविश्वास और
                प्रतिस्पर्धात्मक सोच का विकास हो सके।
              </p>

              <br />

              <p>
                संगठन ने केवल शिक्षा तक स्वयं को सीमित नहीं रखा। आपसी भाईचारे और
                मजबूत संबंधों को बढ़ावा देने के लिए पिकनिक, सांस्कृतिक कार्यक्रम
                तथा सामाजिक गतिविधियों का भी नियमित आयोजन किया गया। इन
                कार्यक्रमों ने युवाओं को एक-दूसरे के अनुभवों से सीखने, नए मित्र
                बनाने और एक परिवार की तरह जुड़ने का अवसर प्रदान किया।
              </p>

              <br />

              <p>
                MYWA का प्रत्येक कार्यक्रम केवल एक आयोजन नहीं, बल्कि युवाओं के
                आत्मविश्वास, नेतृत्व क्षमता और सामाजिक सहभागिता को मजबूत बनाने
                की दिशा में एक महत्वपूर्ण कदम रहा है। यही निरंतर प्रयास आज संगठन
                को केवल एक छात्र समूह नहीं, बल्कि युवाओं के समग्र विकास के लिए
                समर्पित एक सशक्त परिवार बनाता है।
              </p>
            </>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              <Pillar
                icon={<IconLibrary size={22} />}
                label="पुस्तकालय सुविधा"
              />

              <Pillar icon={<IconMovie size={22} />} label="मोटिवेशनल फिल्म" />

              <Pillar icon={<IconTrophy size={22} />} label="प्रतियोगिताएँ" />

              <Pillar icon={<IconUsers size={22} />} label="करियर मार्गदर्शन" />

              <Pillar
                icon={<IconMapPin size={22} />}
                label="पिकनिक एवं भ्रमण"
              />

              <Pillar icon={<IconHeart size={22} />} label="सामाजिक सहयोग" />
            </div>
          </ParagraphBlock>

          {/* Achievements */}
          <ParagraphBlock tag="Achievements" tagIndigo delay={0.1}>
            <>
              <p>
                किसी भी संस्था की वास्तविक सफलता उसकी इमारतों, संसाधनों या
                कार्यक्रमों से नहीं मापी जाती, बल्कि उन लोगों से मापी जाती है
                जिनके जीवन में वह सकारात्मक परिवर्तन ला सके। MYWA के लिए भी उसकी
                सबसे बड़ी उपलब्धि वे युवा हैं जिन्होंने इस परिवार से जुड़कर अपने
                सपनों को नई दिशा दी और अपने लक्ष्य को प्राप्त किया।
              </p>

              <br />

              <p>
                पिछले वर्षों में MYWA के मार्गदर्शन, सहयोग और सकारात्मक वातावरण
                का लाभ उठाते हुए अनेक युवाओं ने विभिन्न राजकीय सेवाओं में अपनी
                पहचान बनाई। यह केवल व्यक्तिगत सफलता नहीं, बल्कि पूरे संगठन और
                समाज के लिए गर्व का विषय है। प्रत्येक चयनित युवा आने वाली
                पीढ़ियों के लिए प्रेरणा का स्रोत बनकर यह संदेश देता है कि सही
                मार्गदर्शन, निरंतर परिश्रम और सामूहिक सहयोग से हर सपना साकार
                किया जा सकता है।
              </p>

              <br />

              <p>
                MYWA का विश्वास हमेशा से रहा है कि जब एक युवा सफल होता है, तो
                उसके साथ केवल उसका परिवार ही नहीं, बल्कि पूरा समाज आगे बढ़ता है।
                यही सोच संगठन को निरंतर युवाओं के लिए नए अवसर, बेहतर मार्गदर्शन
                और सकारात्मक वातावरण उपलब्ध कराने के लिए प्रेरित करती है।
              </p>
            </>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-10 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-7">
              राजकीय सेवाओं में चयनित युवा
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                  {
                    name: "श्री राहुल जोशी",
                    selection: "राजकीय सेवा",
                  },
                  {
                    name: "श्री गणेश गोस्वामी",
                    selection: "राजकीय सेवा",
                  },
                  {
                    name: "श्री त्रिभुवन नितवाल",
                    selection: "राजकीय सेवा",
                  },
                  {
                    name: "श्री धर्मेन्द्र मर्तोलिया",
                    selection: "CRPF (SI)",
                  },
                  {
                    name: "कु० मनीषा  रावत",
                    selection: "राजकीय सेवा",
                  },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="rounded-xl border border-white/5 bg-white/2 p-4">
                    <div className="text-lg font-semibold text-white">
                      {s.name}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {s.selection}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </ParagraphBlock>

          {/* 6 — Haldwani */}
          <ParagraphBlock tag="Expansion" tagIndigo delay={0.1}>
            <>
              <p>
                किसी भी संस्था के लिए सबसे बड़ी उपलब्धि तब होती है जब उसके
                कार्यों पर लोगों का विश्वास बढ़ने लगता है। MYWA के साथ भी कुछ
                ऐसा ही हुआ। देहरादून में युवाओं के लिए किए गए निरंतर प्रयासों,
                सहयोग और सकारात्मक कार्यों को देखते हुए संगठन का विस्तार कुमाऊँ
                क्षेत्र के दूसरे प्रमुख शहर{" "}
                <span className="text-teal-400 font-semibold">हल्द्वानी</span>
                तक किया गया।
              </p>

              <br />

              <p>
                इस विस्तार का उद्देश्य केवल एक नई शाखा खोलना नहीं था, बल्कि अधिक
                से अधिक युवाओं तक MYWA के सहयोग, मार्गदर्शन और अवसरों को
                पहुँचाना था। संगठन का विश्वास है कि चाहे कोई भी युवा किसी भी शहर
                में शिक्षा या प्रतियोगी परीक्षाओं की तैयारी के लिए जाए, उसे एक
                ऐसे परिवार का साथ अवश्य मिले जो हर परिस्थिति में उसके साथ खड़ा
                रहे।
              </p>

              <br />

              <p>
                आज MYWA का यह विस्तार इस बात का प्रतीक है कि सेवा, सहयोग और
                विश्वास की भावना सीमाओं में नहीं बंधती। जहाँ भी युवाओं को
                मार्गदर्शन और सहयोग की आवश्यकता होगी, वहाँ MYWA उनके साथ खड़े
                रहने का निरंतर प्रयास करता रहेगा।
              </p>
            </>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <h1>📍 हमारी पहुँच</h1>
              <br />
              <h2>🏙️ देहरादून</h2>↓<h2> 🌄 हल्द्वानी</h2>↓
              <p> 🚀 आने वाले समय में उत्तराखण्ड के अन्य शहर...</p>
            </motion.div>
          </ParagraphBlock>

          {/* 7 — future vision */}
          <ParagraphBlock tag="Future Vision" delay={0.1}>
            <>
              <p>
                MYWA की यात्रा अभी समाप्त नहीं हुई है, बल्कि यह एक ऐसे भविष्य की
                ओर बढ़ रही है जहाँ प्रत्येक युवा को शिक्षा, मार्गदर्शन, अवसर और
                सहयोग समान रूप से उपलब्ध हो। संगठन का विश्वास है कि समाज का
                वास्तविक विकास तभी संभव है जब युवाओं को सही दिशा, उचित संसाधन और
                आत्मविश्वास के साथ आगे बढ़ने का अवसर मिले।
              </p>

              <br />

              <p>
                आने वाले वर्षों में MYWA का लक्ष्य अधिक से अधिक विद्यार्थियों तक
                अपनी सेवाओं का विस्तार करना, पुस्तकालय एवं अध्ययन सुविधाओं को और
                सशक्त बनाना, करियर मार्गदर्शन, कौशल विकास, व्यक्तित्व विकास तथा
                प्रतियोगी परीक्षाओं की तैयारी के लिए बेहतर मंच तैयार करना है।
                साथ ही आधुनिक तकनीक और अनुभवी मार्गदर्शकों के सहयोग से युवाओं को
                बदलते समय के अनुरूप नए अवसरों से जोड़ना भी संगठन की प्राथमिकताओं
                में शामिल है।
              </p>

              <br />

              <p>
                MYWA केवल एक संस्था नहीं, बल्कि एक ऐसा परिवार है जो हर उस युवा
                के साथ खड़ा है जो अपने सपनों को साकार करने का साहस रखता है।
                हमारा विश्वास है कि आज जिन युवाओं को सहयोग और मार्गदर्शन मिलेगा,
                वही कल समाज का नेतृत्व करेंगे और आने वाली पीढ़ियों के लिए
                प्रेरणा बनेंगे।
              </p>

              <br />

              <p>
                हम एक ऐसे भविष्य की कल्पना करते हैं जहाँ कोई भी युवा अवसरों की
                कमी, मार्गदर्शन के अभाव या संसाधनों की सीमाओं के कारण अपने सपनों
                से समझौता न करे। यही सोच हमारी यात्रा की सबसे बड़ी प्रेरणा है और
                यही MYWA के भविष्य का आधार भी है।
              </p>
            </>
          </ParagraphBlock>
        </div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap justify-center gap-10 py-8 border-t border-white/5 mb-16">
          <StatItem num="2022" label="Founded" />
          <StatItem num="2" label="City Branches" />
          <StatItem num="∞" label="Connections" />
          <StatItem
            num={
              <span
                style={{
                  fontFamily: "'Tiro Devanagari Hindi', serif",
                  fontSize: 22,
                  paddingTop: 4,
                }}>
                परिवार
              </span>
            }
            label="Always"
          />
        </motion.div>

        {/* ── Closing Quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-24 overflow-hidden rounded-3xl border border-white/10 p-10 md:p-14 text-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(20,184,166,0.05) 100%)",
          }}>
          {/* Glow */}
          <div
            className="absolute -top-28 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle,#14b8a6 0%,transparent 70%)",
            }}
          />

          {/* Top Quote Icon */}

          <div className="relative z-10 flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-4xl text-teal-400">
              ❝
            </div>
          </div>

          {/* Quote */}

          <h3
            className="relative z-10 text-[clamp(22px,3vw,34px)] font-bold leading-[1.8] text-white"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            जब एक युवा आगे बढ़ता है,
            <br />
            <span className="text-teal-400">तो केवल उसका भविष्य नहीं,</span>
            <br />
            पूरा समाज आगे बढ़ता है।
          </h3>

          {/* Divider */}

          <div className="relative z-10 w-24 h-0.5 bg-linear-to-r from-teal-400 to-indigo-500 mx-auto my-8 rounded-full" />

          {/* Description */}

          <p
            className="relative z-10 max-w-3xl mx-auto text-slate-300 text-[16px] md:text-[18px] leading-9"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            MYWA केवल एक संगठन नहीं, बल्कि{" "}
            <span className="text-teal-300 font-semibold">सपनों</span>,
            <span className="text-indigo-300 font-semibold"> सहयोग</span> और
            <span className="text-teal-300 font-semibold"> विश्वास</span> से बना
            एक ऐसा परिवार है जहाँ हर युवा की सफलता हम सभी की सफलता मानी जाती है।
          </p>

          {/* Bottom Line */}

          <p
            className="relative z-10 mt-8 text-slate-400 italic text-lg"
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
            "आइए, मिलकर ऐसा भविष्य बनाएं जहाँ कोई भी युवा अपने सपनों की राह में
            अकेला न रहे।"
          </p>

          {/* CTA */}

          <div className="relative z-10 mt-10">
            <Link
             to="/login"
              className="inline-flex items-center gap-3 rounded-full border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300 px-7 py-3 text-teal-300 font-medium">
              🤝 हमारे परिवार से जुड़ें
            </Link>
          </div>

          {/* Footer */}

          <div className="relative z-10 mt-10 flex justify-center items-center gap-3">
            <div className="h-px w-14 bg-linear-to-r from-transparent to-teal-400" />

            <span className="font-mono tracking-[0.25em] text-sm text-slate-500 uppercase">
              MYWA FAMILY
            </span>

            <div className="h-px w-14 bg-linear-to-l from-transparent to-indigo-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
