import { Button } from '@/components/ui/button';
import { auth } from '@/features/authentication/auth';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { ProfileIcon } from '@/features/authentication/components/profile-icon'
import { RemoveUserForm } from '@/features/authentication/forms/remove-user-form'
import { SignoutForm } from '@/features/authentication/forms/signout-form'

export async function User() {
  let session = await auth();
  let user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          {user ? (
            <ProfileIcon name={user.email} />
          ) : (
            <Image
              alt="User icon"
              className="rounded-full"
              height="32"
              src="/user.svg"
              width="32"
            />
          )
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <>
          <DropdownMenuItem>
            <RemoveUserForm email={user.email}/>
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
