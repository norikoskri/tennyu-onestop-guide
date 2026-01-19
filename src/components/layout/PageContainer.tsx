"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={clsx(
        "max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6",
        "lg:ml-64 lg:max-w-none lg:mr-4",
        className
      )}
    >
      {children}
    </main>
  );
}
