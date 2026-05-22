import { Navbar } from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <Navbar />
      <section className="flex min-h-screen flex-col justify-between">
        <div className="flex flex-1 items-center justify-center">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-9xl font-bold text-stone-950 dark:text-stone-50">
              404
            </h1>
            <p className="py-4 text-lg text-stone-700 dark:text-stone-300">
              Sorry, we couldn't find your page.
            </p>

            <div className="mt-8 flex items-center justify-center">
              <Link to="/">
                <Button size="lg" variant="default">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};
