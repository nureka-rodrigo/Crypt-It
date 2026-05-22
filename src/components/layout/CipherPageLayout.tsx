import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";

interface CipherPageLayoutProps {
  category: string;
  categoryHref: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
}

export const CipherPageLayout: React.FC<CipherPageLayoutProps> = ({
  category,
  categoryHref,
  title,
  description,
  children,
}) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 pt-8 font-mono text-xs text-stone-400 dark:text-stone-600">
            <Link
              to="/"
              className="transition-colors hover:text-stone-600 dark:hover:text-stone-400"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to={categoryHref}
              className="transition-colors hover:text-stone-600 dark:hover:text-stone-400"
            >
              {category}
            </Link>
            <span>/</span>
            <span className="text-stone-600 dark:text-stone-400">{title}</span>
          </nav>

          {/* Two-column layout */}
          <div className="py-10 lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Left: educational content */}
            <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-amber-500">
                {category}
              </p>
              <h1 className="mb-8 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 lg:text-4xl">
                {title}
              </h1>
              <div className="space-y-4 text-base leading-7 text-stone-600 dark:text-stone-400">
                {description}
              </div>
            </div>

            {/* Right: interactive tool */}
            <div className="mt-12 lg:col-span-7 lg:mt-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
