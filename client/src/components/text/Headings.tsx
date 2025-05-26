import { ReactNode } from "react";

export const Heading = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h1 className={`text-2xl uppercase font-bold ${className}`}>{children}</h1>;
};
