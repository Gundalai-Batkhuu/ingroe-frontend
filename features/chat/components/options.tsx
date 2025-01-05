import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

export function Options() {
	return (
		<div className="flex">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<EllipsisVertical className="w-10 text-gray-400" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Chat mode</DropdownMenuItem>
					<DropdownMenuItem>
						Smart note configuration
					</DropdownMenuItem>
					<DropdownMenuItem>Change instructions</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
