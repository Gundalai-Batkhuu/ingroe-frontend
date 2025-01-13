import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';

interface NewAssistantCardProps {
	setTitle: (title: string) => void;
	setDescription: (description: string) => void;
	setInstructions: (instructions: string) => void;
}

export function NewAssistantCard({
	setTitle,
	setDescription,
	setInstructions
}: NewAssistantCardProps) {
	const [localTitle, setLocalTitle] = useState('');
	const [localDescription, setLocalDescription] = useState('');
	const [localInstructions, setLocalInstructions] = useState('');
	const [isTogglePressed, setIsTogglePressed] = useState(false);

	const isFormValid =
		localTitle.trim() !== '' &&
		localDescription.trim() !== '' &&
		isTogglePressed;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTitle(localTitle);
		setDescription(localDescription);
		setInstructions(localInstructions);
	};

	return (
		<Card className="flex h-full flex-col border-0 shadow-none">
			<CardHeader>
				<CardTitle>Add details</CardTitle>
			</CardHeader>

			<form onSubmit={handleSubmit} className="flex flex-1 flex-col">
				<CardContent className="flex-1">
					<div className="grid gap-16">
						<div className="space-y-6">
							<div className="flex gap-4">
								<Label htmlFor="worker-title" className="w-24">
									Title{' '}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="worker-title"
									value={localTitle}
									onChange={e =>
										setLocalTitle(e.target.value)
									}
									placeholder="Enter worker title"
									required
								/>
							</div>
							<div className="flex gap-4">
								<Label
									htmlFor="worker-description"
									className="w-24"
								>
									Description{' '}
									<span className="text-red-500">*</span>
								</Label>
								<Textarea
									id="worker-description"
									value={localDescription}
									onChange={e =>
										setLocalDescription(e.target.value)
									}
									placeholder="Enter worker description"
									rows={3}
									required
								/>
							</div>
							<div className="flex gap-4">
								<Label
									htmlFor="worker-instructions"
									className="w-24"
								>
									Instructions
								</Label>
								<Textarea
									id="worker-instructions"
									value={localInstructions}
									onChange={e =>
										setLocalInstructions(e.target.value)
									}
									placeholder="Enter worker instructions"
									rows={3}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-6">
							<CardTitle>Select service type</CardTitle>
							<Toggle
								className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-gray-300"
								pressed={isTogglePressed}
								onPressedChange={setIsTogglePressed}
							>
								<div className="text-center">
									Ask your files
								</div>
							</Toggle>
						</div>
					</div>
				</CardContent>
				<CardFooter className="mt-auto justify-end">
					<Button type="submit" disabled={!isFormValid}>
						Continue
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
