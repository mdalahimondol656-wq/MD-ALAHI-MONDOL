import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import SectionDivider from "@/components/SectionDivider";

export const metadata = {
  title: "MD ALAHI MONDOL — CV Portfolio",
  description: "Graduate Psychologist / Research Consultant",
};

export default function Home() {
  return (
    <>
      <Hero />
      <SectionDivider />
      <Stats />
      <SectionDivider />
      <About />
      <SectionDivider />
      <ExperienceTimeline />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Contact />
    </>
  );
}
