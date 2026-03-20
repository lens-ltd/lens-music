import { SkeletonLoader } from "@/components/inputs/Loader";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  isLoading?: boolean;
}

export const Heading = ({
  children,
  className,
  id,
  type = "h1",
  isLoading,
}: HeadingProps) => {
  switch (type) {
    case "h1":
      return (
        <h1
          id={id}
          className={`text-xl uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="20vw" /> : children}
        </h1>
      );
    case "h2":
      return (
        <h2
          id={id}
          className={`text-lg uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="15vw" /> : children}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={id}
          className={`text-base uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="15vw" /> : children}
        </h3>
      );
    case "h4":
      return (
        <h4
          id={id}
          className={`text-sm uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="15vw" /> : children}
        </h4>
      );
    case "h5":
      return (
        <h5
          id={id}
          className={`text-xs uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="15vw" /> : children}
        </h5>
      );
    case "h6":
      return (
        <h6
          id={id}
          className={`text-xs uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="15vw" /> : children}
        </h6>
      );
    default:
      return (
        <h1
          id={id}
          className={`text-xl uppercase font-semibold text-primary ${className}`}
        >
          {isLoading ? <SkeletonLoader type="text" width="20vw" /> : children}
        </h1>
      );
  }
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
    <p
      id={id}
      className={`text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-normal ${className}`}
    >
      {children}
    </p>
  );
};
