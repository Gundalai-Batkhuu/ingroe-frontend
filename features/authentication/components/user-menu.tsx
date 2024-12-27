import { Button } from '@/components/ui/button';
import { auth } from '@/features/authentication/auth';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { ProfileIcon } from '@/features/authentication/components/profile-icon';
import { RemoveUserForm } from '@/features/authentication/forms/remove-user-form';
import { SignoutForm } from '@/features/authentication/forms/signout-form';
import { IconUser } from '@/components/ui/icons';
import { ChevronDown } from 'lucide-react';

export async function UserMenu() {
	let session = await auth();
	let user = session?.user;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="overflow-hidden rounded-full"
					>
						{user ? (
							<ProfileIcon name={user.email} />
						) : (
							<IconUser />
						)}
					</Button>
					<ChevronDown className="size-4 text-muted-foreground" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuItem>Support</DropdownMenuItem>
				<DropdownMenuSeparator />
				{user ? (
					<>
						<DropdownMenuItem>
							<RemoveUserForm email={user.email} />
						</DropdownMenuItem>
						<DropdownMenuItem>
							<SignoutForm />
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem>
							<Link href="/login">Sign In</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link href="/signup">Sign Up</Link>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
