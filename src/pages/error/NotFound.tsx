import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <section className="flex items-center justify-center min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-neutral-950 dark:text-neutral-50 text-center text-9xl font-bold">
            404
          </h1>
          <p className="text-neutral-950 dark:text-neutral-50 text-center py-4 text-lg">
            Sorry, we couldn't find your page.
          </p>

          <div className="flex justify-center items-center mt-8">
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
