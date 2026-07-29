import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import SectionDivider from "@/components/SectionDivider";
import { fetchProfile, fetchEducation, fetchExperiences, fetchProjects, fetchStats, fetchContactInfo } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MD ALAHI MONDOL — CV Portfolio",
  description: "Graduate Psychologist / Research Consultant — CV Portfolio",
};

export default async function Home() {
  let profile = null;
  let education: any[] = [];
  let experiences: any[] = [];
  let projects: Record<string, any[]> = {};
  let stats: any[] = [];
  let contactInfo = null;

  try {
    [profile, education, experiences, projects, stats, contactInfo] = await Promise.all([
      fetchProfile(),
      fetchEducation(),
      fetchExperiences(),
      fetchProjects(),
      fetchStats(),
      fetchContactInfo(),
    ]);
  } catch {
    // Server-side fetch failed; client components will use their fallback data
  }

  return (
    <>
      <Hero initialProfile={profile} />
      <SectionDivider />
      <Stats initialStats={stats} />
      <SectionDivider />
      <About initialProfile={profile} />
      <SectionDivider />
      <ExperienceTimeline initialEducation={education} initialExperiences={experiences} />
      <SectionDivider />
      <Projects initialProjects={projects} />
      <SectionDivider />
      <Contact initialContactInfo={contactInfo} />
    </>
  );
}
