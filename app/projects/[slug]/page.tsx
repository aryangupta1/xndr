import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { projects, projectImage } from "@/lib/content";

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

  // Has Rinay supplied the deeper detail yet?
  const hasDetail =
    (project.scope?.length ?? 0) > 0 ||
    (project.services?.length ?? 0) > 0 ||
    (project.details?.length ?? 0) > 0;

  return (
    <>
      <Nav />
      <main className="project-page">
        <div className="container">
          <Link className="project-back" href="/#projects">
            ← All projects
          </Link>

          <div className="project-detail">
            <div className="project-figure">
              <Image
                src={projectImage(project.image, 1200)}
                alt={`${project.title} — ${project.category} project in ${project.location}`}
                width={1200}
                height={1500}
                priority
              />
            </div>

            <div className="project-body">
              <span className="eyebrow">{project.category}</span>
              <h1>{project.title}</h1>
              <p className="project-summary">{project.summary}</p>

              <dl className="project-facts">
                <div>
                  <dt>Location</dt>
                  <dd>{project.location}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{project.category}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
                {project.client && (
                  <div>
                    <dt>Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                )}
              </dl>

              {project.services && project.services.length > 0 && (
                <div className="project-block">
                  <h2>Services provided</h2>
                  <ul className="project-list">
                    {project.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.scope && project.scope.length > 0 && (
                <div className="project-block">
                  <h2>Scope of works</h2>
                  <ul className="project-list">
                    {project.scope.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.details && project.details.length > 0 && (
                <div className="project-block">
                  <h2>About the project</h2>
                  {project.details.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {!hasDetail && (
                <p className="project-note">
                  A detailed case study for this project is coming soon.
                </p>
              )}

              <Link className="btn btn-primary" href="/#contact">
                Discuss a similar project
              </Link>
            </div>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="project-gallery">
              {project.gallery.map((src) => (
                <div className="project-gallery-item" key={src}>
                  <Image
                    src={projectImage(src, 1000)}
                    alt={`${project.title} — additional photo`}
                    width={1000}
                    height={750}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
