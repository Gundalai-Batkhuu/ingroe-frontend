import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EditDocumentButtonProps {
	document_id: string;
}

export default function EditDocumentButton({
	document_id
}: EditDocumentButtonProps) {
	const router = useRouter();
	const handleEdit = () => {
		router.push(`/databases/${document_id}`);
	};

	return (
		<Button variant={'link'} onClick={handleEdit}>
			Edit
		</Button>
	);
}
