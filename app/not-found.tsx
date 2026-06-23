import { ArrowLeftIcon, FileQuestionMark } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionMark />
        </EmptyMedia>
        <EmptyTitle as="h1" className="font-semibold text-lg">
          404 - Page Not Found
        </EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist <br /> or has been moved.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href="/" className={buttonVariants()}>
          <ArrowLeftIcon aria-hidden="true" />
          Back to home
        </Link>
      </EmptyContent>
    </Empty>
  );
}
