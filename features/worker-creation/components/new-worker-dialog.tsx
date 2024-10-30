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

interface NewWorkerDialogProps {
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: () => void
}

export function NewWorkerDialog({ setTitle, setDescription, open, onOpenChange, onSubmit }: NewWorkerDialogProps) {
    const [localTitle, setLocalTitle] = useState("")
    const [localDescription, setLocalDescription] = useState("")
    const [step, setStep] = useState(1)

    useEffect(() => {
        if (open) {
            setLocalTitle("")
            setLocalDescription("")
            setStep(1)
        }
    }, [open])

    const handleFirstStep = (e: React.FormEvent) => {
        e.preventDefault()
        setTitle(localTitle)
        setDescription(localDescription)
        setStep(2)
    }

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit()
        onOpenChange(false)
    }

    const handleBack = () => {
        setStep(1)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                {step === 1 ? (
                    <form onSubmit={handleFirstStep}>
                        <DialogHeader>
                            <DialogTitle>Create New Worker</DialogTitle>
                            <DialogDescription>Enter title and description of your new worker</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="worker-title">Title</Label>
                                    <Input
                                        id="worker-title"
                                        value={localTitle}
                                        onChange={(e) => setLocalTitle(e.target.value)}
                                        placeholder="Enter worker title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="worker-description">Description</Label>
                                    <Textarea
                                        id="worker-description"
                                        value={localDescription}
                                        onChange={(e) => setLocalDescription(e.target.value)}
                                        placeholder="Enter worker description"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Continue</Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <form onSubmit={handleFinalSubmit}>
                        <DialogHeader>
                            <DialogTitle>Confirm Worker Creation</DialogTitle>
                            <DialogDescription>Please review your worker details before creating</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                                <div>
                                    <Label>Title</Label>
                                    <p className="mt-1 text-sm text-gray-600">{localTitle}</p>
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <p className="mt-1 text-sm text-gray-600">{localDescription}</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={handleBack}>
                                Back
                            </Button>
                            <Button type="submit">Create Worker</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}