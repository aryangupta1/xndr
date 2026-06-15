import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectDetail from "@/components/ProjectDetail";
import { projects } from "@/lib/content";

// Pre-render one static page per project at build time.
export function generateStaticParams() {
  return projects.items.map((p) => ({ slug: p.slug }));
}

function getProject(slug: string) {
  return projects.items.find((p) => p.slug === slug);
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Project not found — XNDR" };
  return {
    title: `${project.title}, ${project.location} — XNDR`,
    description: project.summary,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <ProjectDetail project={project} />
      <Footer />
    </>
  );
}
