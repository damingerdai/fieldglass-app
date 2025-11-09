import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const appSpinnerVariants = cva(
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

const appLoaderVariants = cva("animate-spin text-primary", {
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

interface AppSpinnerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof appSpinnerVariants>,
    VariantProps<typeof appLoaderVariants> {
  asChild?: boolean;
}

function AppSpinner({
  className,
  size,
  show,
  asChild = false,
  ...props
}: AppSpinnerProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={cn(appSpinnerVariants({ show }), className)} {...props}>
      <Loader2 className={appLoaderVariants({ size })} />
      {props.children}
    </Comp>
  );
}

export { AppSpinner, appSpinnerVariants, appLoaderVariants };
