import { MoreHorizontal, User } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AdminDashboardContent() {
	return (
		<div className="mx-auto w-full max-w-6xl space-y-4 p-4">
			{/* Main Content */}
			<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
				{/* Left Panel */}
				<div className="w-full space-y-4 md:w-1/3">
					<div className="flex aspect-square items-center justify-center rounded-full bg-gray-200">
						<div className="h-3/4 w-3/4 rounded-full border-8 border-gray-300"></div>
					</div>
					<div className="space-y-2">
						{[1, 2, 3].map(item => (
							<div
								key={item}
								className="flex items-center justify-between"
							>
								<div className="h-2 w-1/2 rounded bg-gray-300"></div>
								<div className="h-2 w-1/4 rounded bg-gray-300"></div>
							</div>
						))}
					</div>
				</div>

				{/* Right Panel */}
				<div className="w-full space-y-4 md:w-2/3">
					<div className="mb-4 flex items-center justify-between">
						<div className="h-2 w-1/3 rounded bg-gray-300"></div>
						<div className="flex space-x-2">
							<div className="h-2 w-8 rounded bg-gray-300"></div>
							<div className="h-2 w-8 rounded bg-gray-300"></div>
							<div className="h-2 w-8 rounded bg-gray-300"></div>
						</div>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]"></TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[1, 2, 3, 4, 5].map(item => (
								<TableRow key={item}>
									<TableCell>
										<User className="h-6 w-6 text-gray-400" />
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="h-2 w-1/4 rounded bg-gray-300"></div>
											<div className="h-2 w-1/2 rounded bg-gray-200"></div>
										</div>
									</TableCell>
									<TableCell>
										<div className="h-6 w-16 rounded bg-gray-200"></div>
									</TableCell>
									<TableCell>
										<MoreHorizontal className="h-4 w-4 text-gray-400" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<div className="mt-4 flex items-center justify-between">
						<div className="flex space-x-2">
							<div className="h-2 w-8 rounded bg-gray-300"></div>
							<div className="h-2 w-8 rounded bg-gray-300"></div>
						</div>
						<div className="flex space-x-2">
							<div className="h-2 w-8 rounded bg-gray-300"></div>
							<div className="h-2 w-8 rounded bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{[1, 2, 3].map(card => (
					<Card key={card}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<div className="relative h-10 w-10 overflow-hidden rounded-full">
								<Image
									src={`/placeholder.svg?height=40&width=40`}
									alt="Placeholder image"
									layout="fill"
									objectFit="cover"
								/>
							</div>
							<div className="h-2 w-6 rounded bg-gray-300"></div>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="h-2 w-3/4 rounded bg-gray-300"></div>
							<div className="h-2 w-full rounded bg-gray-300"></div>
							<div className="h-2 w-5/6 rounded bg-gray-300"></div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button
								variant="outline"
								className="h-6 w-16"
							></Button>
							<Button className="h-6 w-16"></Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
