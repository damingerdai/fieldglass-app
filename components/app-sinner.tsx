import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const appSpinnerVariants = cva(
  'inline-flex flex-col items-center justify-center',
  {
    variants: {
      show: {
        true: 'flex',
        false: 'hidden'
      }
    },
    defaultVariants: {
      show: true
    }
  }
);

const appLoaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      sm: 'size-6',
      default: 'size-8',
      lg: 'size-12'
    }
  },
  defaultVariants: {
    size: 'default'
  }
});

interface AppSpinnerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof appSpinnerVariants>,
    VariantProps<typeof appLoaderVariants> {
  render?: React.ReactElement;
}

function AppSpinner({
  className,
  size,
  show,
  render,
  children,
  ...props
}: AppSpinnerProps) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(appSpinnerVariants({ show }), className),
        children: (
          <>
            <Loader2 className={appLoaderVariants({ size })} />
            {children}
          </>
        )
      },
      props as React.ComponentProps<'span'>
    ),
    render
  });
}

export { AppSpinner, appSpinnerVariants, appLoaderVariants };
