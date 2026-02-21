import * as React from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

export interface BreadcrumbStep {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbStep[];
  showHome?: boolean;
}

export function AppBreadcrumb({ items, showHome = false }: AppBreadcrumbProps) {
  if (items.length === 0 && !showHome) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.href || index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-muted-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || '#'}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
