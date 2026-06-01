import { cva, type VariantProps } from "class-variance-authority";
import { type CSSProperties, type ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

const skeletonVariants = cva("rounded-md", {
  variants: {
    variant: {
      pulse: "animate-pulse motion-reduce:animate-none bg-muted",
      shimmer: "overflow-hidden bg-surf-3",
    },
  },
  defaultVariants: {
    variant: "pulse",
  },
});

interface SkeletonProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof skeletonVariants> {
  delay?: number;
}

function Skeleton({ className, variant, style, delay, ...props }: SkeletonProps) {
  if (variant === "shimmer") {
    const innerStyle: CSSProperties = {
      background:
        "linear-gradient(90deg, var(--surf-3) 0%, var(--surf-4) 38%, var(--surf-3) 56%, var(--surf-3) 100%)",
      animation: `shimmer 1.8s ease-in-out ${delay ?? 0}ms infinite`,
    };

    return (
      <div
        data-slot="skeleton"
        className={cn(skeletonVariants({ variant }), className)}
        style={style}
        {...props}
      >
        <div className="h-full w-[200%]" style={innerStyle} />
      </div>
    );
  }

  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      style={style}
      {...props}
    />
  );
}

export { Skeleton };
