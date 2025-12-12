import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Order } from "@/pages/Orders";

interface DeleteOrderDialogProps {
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: string) => void;
}

export function DeleteOrderDialog({ order, onClose, onConfirm }: DeleteOrderDialogProps) {
  if (!order) return null;

  return (
    <AlertDialog open={!!order} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order {order.id}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order for{" "}
            <strong>{order.customer}</strong> and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm(order.id);
              onClose();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
