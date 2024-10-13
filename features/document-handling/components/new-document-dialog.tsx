import React, { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"

interface NewDocumentDialogProps {
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewDocumentDialog({ setTitle, setDescription, open, onOpenChange }: NewDocumentDialogProps) {
    const [localTitle, setLocalTitle] = useState("")
    const [localDescription, setLocalDescription] = useState("")

    useEffect(() => {
        if (open) {
            setLocalTitle("")
            setLocalDescription("")
        }
    }, [open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTitle(localTitle)
        setDescription(localDescription)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Document</DialogTitle>
                        <DialogDescription>Enter title and description of your new document</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kb-title">Title</Label>
                                <Input
                                    id="kb-title"
                                    value={localTitle}
                                    onChange={(e) => setLocalTitle(e.target.value)}
                                    placeholder="Enter knowledge base title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kb-description">Description</Label>
                                <Textarea
                                    id="kb-description"
                                    value={localDescription}
                                    onChange={(e) => setLocalDescription(e.target.value)}
                                    placeholder="Enter knowledge base description"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Continue</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}