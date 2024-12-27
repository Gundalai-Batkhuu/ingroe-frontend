import React from 'react';
import { useRouter } from 'next/navigation';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import { Button } from '@/components/ui/button';
import { BotMessageSquare } from 'lucide-react';

interface WorkerChatButtonProps {
	artifactId: string;
}

export const WorkerChatButton: React.FC<WorkerChatButtonProps> = ({
	artifactId
}) => {
	const router = useRouter();
	const { setSelectedArtifactId } = userArtifactsStore();

	const handleClick = () => {
		setSelectedArtifactId(artifactId);
		router.push('/chat');
	};

	return (
		<Button
			onClick={handleClick}
			variant="outline"
			className="gap-2 bg-brand-green text-white hover:bg-brand-green/90 hover:text-white"
		>
			<BotMessageSquare className="size-4" />
			Chat with worker
		</Button>
	);
};
