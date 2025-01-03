'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/icons';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSearchProps {
	className?: string;
}

export function ChatSearch({ className }: ChatSearchProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function searchAction(formData: FormData) {
		let value = formData.get('q') as string;
		let params = new URLSearchParams({ q: value });
		startTransition(() => {
			router.replace(`/?${params.toString()}`);
		});
	}

	return (
		<form
			action={searchAction}
			className={cn("", className)}
		>
			<Search className="absolute left-10 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				name="q"
				type="search"
				placeholder="Search chat..."
				className="w-full rounded-lg pl-12 text-muted-foreground"
			/>
			{isPending && <Spinner />}
		</form>
	);
}
