import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { CarouselComponent } from './carousel';

export default function FirstSectionContent() {
	return (
		<div className="mx-auto max-w-7xl px-6 md:px-12">
			<div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
				<Link
					href="/manage-assistants"
					className="group mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 px-4 py-2 transition-all hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
				>
					<span className="flex items-center gap-2">
						<span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-50 to-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10 dark:from-green-900/20 dark:to-green-900/30 dark:text-green-400 dark:ring-green-500/20">
							Try for Free
						</span>
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Simple pricing, powerful features
						</span>
					</span>
					<div className="flex items-center -space-x-3 transition-transform duration-300 group-hover:translate-x-1">
						<span className="h-[1.5px] w-2.5 origin-left scale-x-0 rounded bg-gray-600 opacity-0 transition duration-300 group-hover:scale-x-100 group-hover:opacity-100 dark:bg-gray-400" />
						<svg
							className="size-4 text-gray-600 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</Link>

				<h1 className="text-title mt-8 text-wrap text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
					AI tools for <br className="hidden sm:block" /> your business
				</h1>
				<p className="text-body mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
					Tailwindcss highly customizable components for building
					modern websites and applications that look and feel the way
					you mean it.
				</p>
				<p className="text-body mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
					Highly customizable components for building modern websites
					and applications, with your personal spark.
				</p>
				<div className="mt-8 flex flex-col items-center justify-center gap-4">
					<Link href="/manage-assistants">
						<Button className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 px-6 text-white shadow-lg transition-all duration-300 hover:from-green-500 hover:to-green-400 hover:shadow-green-500/25 dark:from-green-700 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 dark:hover:shadow-green-700/25">
							<Rocket className="mr-2 size-5 animate-pulse" />
							<span className="text-nowrap text-lg">
								Start Building
							</span>
						</Button>
					</Link>
					<button className="btn variant-ghost sz-lg hidden">
						<span className="text-sm">Learn more</span>
						<svg
							className="-mr-1"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 48 48"
						>
							<path
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="4"
								d="m19 12l12 12l-12 12"
							/>
						</svg>
					</button>
				</div>
			</div>
			<CarouselComponent />
		</div>
	);
}
