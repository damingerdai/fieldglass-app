import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { CreateVacationForm } from "@/components/vacation-form";
import NextLink from "next/link";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-4 gap-4 md:gap-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-muted-foreground">
              <NextLink href="/vacation">
                Vacation
              </NextLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 mdLpy-6 justify-center items-center">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Create Vacation
          </h2>
          <div className="flex flex-1 items-center justify-center w-full max-w-2xl">
            <div className="w-full max-w-xs">
              <div className="flex flex-col gap-6">
                <CreateVacationForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
