"use client"
import { useTransition } from "react"
import { EllipsisVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { deleteVacation } from "./actions/delete-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface VacationMoreMenuProps {
    vacationId: string;
    onDelete?: () => void;
}

export const VacationMoreMenu = (props: VacationMoreMenuProps) => {
  const { vacationId, onDelete } = props;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="rounded-full" variant='secondary' size="icon" aria-label="">
        <EllipsisVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start">
       <DropdownMenuGroup>
          {/* <DropdownMenuItem>
              Edit Vacation
             <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => {
            if (vacationId) {
              startTransition(async() => {
                // Call the server action to delete the vacation
                const res =  await deleteVacation(vacationId);
                if (res.errors) {
                  toast.error(res.errors);
                  return;
                } else if (res.success) {
                  toast.success('Vacation deleted successfully');
                  if (onDelete) {
                    onDelete();
                  }
                  router.refresh();
                }
              });
            }
          }}>
            { isPending ? 'Deleting this vacation' : 'Delete'} 
             {/* <DropdownMenuShortcut>⌘C</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}