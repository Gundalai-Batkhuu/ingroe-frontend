import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShareDocumentDialogProps {
    isOpen: boolean
    onClose: () => void
    onShare: (email: string) => void
}

export function ShareDocumentDialog({ isOpen, onClose, onShare } : ShareDocumentDialogProps) {
  const [shareEmail, setShareEmail] = useState('')

  const handleShare = () => {
    onShare(shareEmail)
    onClose()
    setShareEmail('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share with others by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="email" className="text-center">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="col-span-4"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleShare}>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}