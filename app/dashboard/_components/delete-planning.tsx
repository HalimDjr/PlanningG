import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ClipLoader } from "react-spinners";

import { toast } from "sonner";
import { useModal } from "@/hooks/modal-store";
import { useTransition } from "react";
import { PenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePlanning } from "@/actions/delete";
import { useRouter } from "next/navigation";

export const DeletePlanning = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deletePlanning";
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const onDelete = () => {
    startTransition(() => {
      deletePlanning(data.idPlanning).then((data) => {
        if (data?.success) {
          toast.success(data.success);
        }
        if (data?.error) {
          toast.error(data.error);
        }
        window.location.replace("/dashboard/calendrier");
        onClose();
      });
    });
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center mb-3 flex items-center gap-x-2 justify-center">
            {`Supprimer la version ${data.editData?.version}`}
          </DialogTitle>
          <DialogDescription>
            Voullez vous vraiment supprimer cette version.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-y-3 mt-2 w-full">
          <Button
            className="sm:mr-auto "
            disabled={isPending}
            type="button"
            variant={"secondary"}
            name="saves"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            variant={"primary"}
            name="saves"
            className="bg-black text-white hover:bg-black/80 w-[100px]"
            onClick={onDelete}
          >
            {isPending ? (
              <ClipLoader size={17} color="while" />
            ) : (
              <>Supprimer</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
