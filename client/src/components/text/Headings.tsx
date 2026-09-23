import { SkeletonLoader } from "@/components/inputs/Loader";
import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  isLoading?: boolean;
}

const headingClass: Record<NonNullable<HeadingProps["type"]>, string> = {
  h1: "type-page-title text-(--ink)",
  h2: "type-card-title text-(--ink)",
  h3: "type-label text-(--ink)",
  h4: "type-body-sm font-medium text-(--ink)",
  h5: "type-meta text-(--ink)",
  h6: "text-xs font-medium text-(--muted)",
};

export const Heading = ({
  children,
  className,
  id,
  type = "h1",
  isLoading,
}: HeadingProps) => {
  const Tag = type;
  return (
    <Tag id={id} className={cn(headingClass[type], className)}>
      {isLoading ? <SkeletonLoader type="text" width="20vw" /> : children}
    </Tag>
  );
};

interface RelaxedHeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const RelaxedHeading = ({
  children,
  className,
  id,
}: RelaxedHeadingProps) => {
  return (
    <p id={id} className={cn("type-meta", className)}>
      {children}
    </p>
  );
};
