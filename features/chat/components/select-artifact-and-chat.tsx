import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserArtifactsStore } from '@/stores/userArtifactsStore';
import { Button } from '@/components/ui/button';

interface SelectArtifactAndChatButtonProps {
  artifactId: string;
}

const SelectArtifactAndChatButton: React.FC<SelectArtifactAndChatButtonProps> = ({ artifactId }) => {
  const router = useRouter();
  const { setSelectedArtifactId } = useUserArtifactsStore();

  const handleClick = () => {
    setSelectedArtifactId(artifactId);
    router.push('/chat');
  };

  return (
    <Button onClick={handleClick} variant={'secondary'}>
      Chat
    </Button>
  );
};

export default SelectArtifactAndChatButton;