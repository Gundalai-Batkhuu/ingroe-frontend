'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/icons';
import { Search } from 'lucide-react';

export function SearchInput() {
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
			className="relative ml-auto flex-1 md:grow-0"
		>
			<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				name="q"
				type="search"
				placeholder="Search anything..."
				className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
			/>
			{isPending && <Spinner />}
		</form>
	);
}
