import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserVacations } from "@/lib/vacation-data";
import { format } from "date-fns";
import Link from "next/link";
import { VacationMoreMenu } from "@/components/vacation-more-menu";
import { VacationCard } from "@/components/vacation-card";

export default async function Page() {
  const vacations = await fetchUserVacations();

  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">
              Vacation
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col mt-4 w-full">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/vacation/create">Create Vacation</Link>
          </Button>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Your Vacations</h2>

      {vacations && vacations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vacations.map((vacation) => (
             <VacationCard key={vacation.id} vacation={vacation}/>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          You have no vacation requests submitted yet.
        </p>
      )}
    </div >
  );
}
