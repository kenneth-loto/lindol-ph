import { Suspense } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { HomePageContent } from "@/features/home-page";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl tracking-tight">Lindol PH</h1>
          <ModeToggle />
        </div>
        <p className="text-base text-muted-foreground">
          Philippine seismic activity — past 7 days
        </p>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[50vh] items-center gap-2">
            <Spinner />
            <p className="text-muted-foreground text-sm">
              Gathering seismic analytics...
            </p>
          </div>
        }
      >
        <HomePageContent />
      </Suspense>
    </div>
  );
}
