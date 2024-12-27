'use client';

import React, { useEffect } from 'react';
import { signout } from '@/features/authentication/actions/user-actions';
import { useFormState } from 'react-dom';
import { getMessageFromCode } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function SignoutForm() {
	const [result, formAction] = useFormState(signout, undefined);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		if (result) {
			if (result.type === 'success') {
				toast({
					title: 'Success',
					description: getMessageFromCode(result.resultCode)
				});
				setTimeout(() => {
					router.refresh();
					router.push('/');
				}, 1000);
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: getMessageFromCode(result.resultCode)
				});
			}
		}
	}, [result, router, toast]);

	return (
		<form action={formAction}>
			<button type="submit">Sign Out</button>
		</form>
	);
}
