import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva(
  "inline-flex flex-col items-center justify-center",
  {
    variants: {
      show: {
        true: "flex",
        false: "hidden",
      },
    },
    defaultVariants: {
      show: true,
    },
  },
);

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "size-6",
      default: "size-8",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  asChild?: boolean;
}

function Spinner({
  className,
  size,
  show,
  asChild = false,
  ...props
}: SpinnerProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={cn(spinnerVariants({ show }), className)} {...props}>
      <Loader2 className={loaderVariants({ size })} />
      {props.children}
    </Comp>
  );
}

export { Spinner, spinnerVariants, loaderVariants };
