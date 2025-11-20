import AboutSection from "./components/AboutSection";
import Download from "./components/Download";
import Homepage from "./components/HomePage";

export default function Home() {
const test = 123;
  return (
    <main className="mainpage">
      <Homepage />
      <AboutSection />
      <Download />
    </main>
  );
}
