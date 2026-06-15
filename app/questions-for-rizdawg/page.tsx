import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Hidden, unlisted route. Not linked anywhere in the UI and kept out of search
// engines via noindex (reinforced by a Disallow in app/robots.ts).
export const metadata: Metadata = {
  title: "Questions for Rizdawg — XNDR",
  robots: { index: false, follow: false, nocache: true },
};

// Statically rendered at build time; the markdown is read from the repo's
// QUESTIONS.md so there is a single source of truth.
export default function QuestionsForRizdawg() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "QUESTIONS.md"),
    "utf8",
  );

  return (
    <main className="doc-page">
      <div className="container doc-wrap">
        <p className="eyebrow">Internal · Please complete</p>
        <article className="md-doc">
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </article>
        <p className="doc-foot">
          Hey Rizdawg — answer what you can inline, or just reply to me with the
          numbers. Anything you leave blank stays as placeholder for now.
        </p>
      </div>
    </main>
  );
}
