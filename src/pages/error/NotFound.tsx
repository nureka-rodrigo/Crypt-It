import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <section className="flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-center text-9xl font-bold text-neutral-950 dark:text-neutral-50">
            404
          </h1>
          <p className="py-4 text-center text-lg text-neutral-950 dark:text-neutral-50">
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
      </section>
    </>
  );
};
