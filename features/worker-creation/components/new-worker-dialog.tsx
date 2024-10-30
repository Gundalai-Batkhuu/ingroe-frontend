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
import { Toggle } from "@/components/ui/toggle"

interface NewWorkerDialogProps {
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewWorkerDialog({ setTitle, setDescription, open, onOpenChange }: NewWorkerDialogProps) {
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
        setStep(2)
        setTimeout(() => {
            setTitle(localTitle)
            setDescription(localDescription)
        }, 0)
    }

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 ? "Create New Worker" : "Choose service"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 
                            ? "Enter title and description of your new worker"
                            : "Please choose the service you want to use"
                        }
                    </DialogDescription>
                </DialogHeader>
                
                {step === 1 ? (
                    <form onSubmit={handleFirstStep}>
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
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Toggle className="h-24 w-24 flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg">
                                    <div className="text-center">Ask your files</div>
                                </Toggle>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Worker</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}