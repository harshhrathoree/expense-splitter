import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div className="text-center">

        <h1
          className="
            text-8xl
            font-bold
            text-primary
          "
        >
          404
        </h1>

        <h2
          className="
            text-3xl
            font-semibold
            mt-4
          "
        >
          Page Not Found
        </h2>

        <p
          className="
            text-muted-foreground
            mt-3
            max-w-md
          "
        >
          Looks like the page you're looking
          for doesn't exist or has been moved.
        </p>

        <div
          className="
            flex
            justify-center
            gap-4
            mt-8
          "
        >
          <Button
            onClick={() =>
              navigate("/")
            }
          >
            Go Home
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              navigate(-1)
            }
          >
            Go Back
          </Button>
        </div>

      </div>
    </div>
  );
}

export default NotFound;