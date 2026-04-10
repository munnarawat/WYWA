import { Helmet } from "react-helmet-async";
import PublicHome from "./PublicHome";
const Home = () => {
  return (
    <div className="relative min-h-screen flex items-center text-white pt-20 overflow-hidden">
      <Helmet>
        <title>Munsyari Youth Welfare Association MYWA</title>
        <meta name="description" content="Welcome to Munsyari Youth Welfare Association MYWA. Empowering youth with dedicated library access, community development, and educational initiatives across Dehradun and Haldwani." />
      </Helmet>
      {/* Background Gradients (The Dark Premium Vibe) */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
      </div>
      {/* public home page */}
      <PublicHome />
    </div>
  );
};

export default Home;
