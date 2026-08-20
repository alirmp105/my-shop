import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">دیدن توضیحات</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>توضیحات</DialogTitle>
         
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates minus expedita dolorem animi. Voluptates consectetur atque quidem corporis illo hic a quos temporibus, iure enim vel quis, totam maxime quaerat.
      </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">بستن</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
