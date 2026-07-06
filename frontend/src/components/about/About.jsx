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
    <i className={`ti ti-${icon} text-teal-400 text-lg`} aria-hidden="true" />
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
              <Pillar icon="school" label="कॉलेज एडमिशन" />

              <Pillar icon="book" label="पुस्तकालय" />

              <Pillar icon="home" label="पीजी / आवास" />

              <Pillar icon="heart" label="रक्तदान सहायता" />

              <Pillar icon="briefcase" label="करियर मार्गदर्शन" />

              <Pillar icon="users" label="युवा सहयोग" />

              <Pillar icon="target-arrow" label="प्रतियोगी परीक्षाएँ" />

              <Pillar icon="sparkles" label="व्यक्तित्व विकास" />

              <Pillar icon="messages" label="आपसी समन्वय" />
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
              <Pillar icon="library" label="पुस्तकालय सुविधा" />

              <Pillar icon="movie" label="मोटिवेशनल फिल्म" />

              <Pillar icon="trophy" label="प्रतियोगिताएँ" />

              <Pillar icon="users-group" label="करियर मार्गदर्शन" />

              <Pillar icon="map-pin" label="पिकनिक एवं भ्रमण" />

              <Pillar icon="heart-handshake" label="सामाजिक सहयोग" />
            </div>
          </ParagraphBlock>

          {/* 6 — Haldwani */}
          <ParagraphBlock tag="विस्तार · हल्द्वानी" tagIndigo delay={0.1}>
            MYWA के निरंतर प्रयासों को देखते हुए इसका विस्तार{" "}
            <span className="text-teal-400 font-semibold">हल्द्वानी</span> तक
            किया गया — ताकि कुमाऊँ क्षेत्र के और अधिक युवा इस परिवार का हिस्सा
            बन सकें।
          </ParagraphBlock>

          {/* 7 — Today */}
          <ParagraphBlock tag="Today" delay={0.1}>
            आज MYWA केवल एक संस्था नहीं, बल्कि{" "}
            <span className="text-teal-400 font-semibold">
              हजारों युवाओं का विश्वास
            </span>{" "}
            है। अनेक युवाओं का विभिन्न राजकीय सेवाओं में चयन इस बात का प्रमाण है
            कि सही मार्गदर्शन और सहयोग किसी भी सपने को वास्तविकता में बदल सकता
            है।
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
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative p-10 text-center border border-indigo-500/20 rounded-[20px] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(99,102,241,0.06) 0%,rgba(20,184,166,0.04) 100%)",
          }}>
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
            style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
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
