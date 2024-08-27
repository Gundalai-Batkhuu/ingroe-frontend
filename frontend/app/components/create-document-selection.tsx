import React, { FormEvent } from 'react';
import { ApiEndpoint } from '@/app/enums';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    userId: string;
    links: string[];
}

export const CreateDocumentSelection: React.FC<SearchBarProps> = ({
    userId,
    links
}) => {
    const router = useRouter();

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Uploading documents with parameters:', {
            userId,
            links
        });

        try {
            const response = await fetch(ApiEndpoint.CREATE_DOCUMENT_SELECTION, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    links: links
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Search results:', data);
            router.push('/chat');

        } catch (error) {
            console.error('Error during search:', error);
        }
    }

    return (
        <form onSubmit={handleSearch} className="flex items-stretch">
            <Button variant="ghost" className="bg-emerald-900 hover:bg-emerald-800">
                Submit documents
            </Button>
        </form>
    );
};