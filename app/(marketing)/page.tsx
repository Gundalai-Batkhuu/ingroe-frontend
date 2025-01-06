import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Search, Brain } from 'lucide-react';
import Link from 'next/link';

export default async function MarketingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="flex items-center justify-center">
									{/*<Brain className="h-12 w-12 text-primary" />*/}
									<h1 className="ml-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
										Ingroe
									</h1>
								</div>
								<p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
									Your collaborative platform for sharing and
									discovering knowledge. Join our community of
									learners and experts.
								</p>
							</div>
							<div className="space-x-4">
								<Button>Get Started</Button>
								<Button variant="outline">Learn More</Button>
							</div>
						</div>
					</div>
				</section>
				<section className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
							Key Features
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<BookOpen className="mr-2 h-4 w-4" />{' '}
										Extensive Knowledge Base
									</CardTitle>
								</CardHeader>
								<CardContent>
									Access a vast collection of articles,
									tutorials, and resources on various topics.
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Users className="mr-2 h-4 w-4" />{' '}
										Collaborative Learning
									</CardTitle>
								</CardHeader>
								<CardContent>
									Connect with experts and fellow learners to
									share insights and solve problems together.
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Search className="mr-2 h-4 w-4" />{' '}
										Smart Search
									</CardTitle>
								</CardHeader>
								<CardContent>
									Find the information you need quickly with
									our advanced search and recommendation
									system.
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Join Our Community
								</h2>
								<p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Be part of a growing network of knowledge
									enthusiasts. Share your expertise, learn
									from others, and contribute to the
									collective wisdom of Knowledge Commons.
								</p>
							</div>
							<Link href="/signup">
								<Button>Sign Up Now</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					© 2024 Knowledge Commons. All rights reserved.
				</p>
				<nav className="flex gap-4 sm:ml-auto sm:gap-6">
					<a
						className="text-xs underline-offset-4 hover:underline"
						href="#"
					>
						Terms of Service
					</a>
					<a
						className="text-xs underline-offset-4 hover:underline"
						href="#"
					>
						Privacy
					</a>
				</nav>
			</footer>
		</div>
	);
}
