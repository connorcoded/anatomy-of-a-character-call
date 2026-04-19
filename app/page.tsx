import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Article } from "@/components/Article";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ReadingProgress } from "@/components/ReadingProgress";

export default function Page() {
  return (
    <main>
      <ReadingProgress />
      <Header />
      <Hero />
      <Article />
      <div className="mx-auto max-w-measure px-6">
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
