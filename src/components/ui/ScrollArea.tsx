"use client";

import { cn } from "@/lib/cn";
import { forwardRef, type CSSProperties, type ReactNode } from "react";

type ScrollAreaProps = {
  children: ReactNode;
  className?: string;
  maxHeight?: number | string;
  style?: CSSProperties;
  orientation?: "vertical" | "horizontal";
} & Omit<React.ComponentPropsWithoutRef<"div">, "children" | "className" | "style">;

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    { children, className, maxHeight, style, orientation = "vertical", ...rest },
    ref,
  ) {
    const horizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        className={cn(
          "custom-scrollbar",
          horizontal
            ? "overflow-x-auto overflow-y-hidden"
            : "overflow-y-auto overflow-x-hidden",
          className,
        )}
        style={{
          maxHeight: horizontal ? undefined : maxHeight,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
