import { Card, CardContent } from '@/components/ui/card';
import {
	AICommunicationIcon,
	AccessibilityIcon,
	IntelligenceIcon,
	SmartDatabaseManagementIcon,
	ModernUIIcon,
} from './icons';

export default function SecondSectionContent() {
	return (
		<div className="mx-auto max-w-6xl px-6">
			<div className="relative">
				<div className="text-center">
					<h2 className="text-3xl font-semibold text-gray-950 dark:text-white">
						Powerful features that set <br /> Ingroe apart
					</h2>
					<p className="mt-6 text-gray-700 dark:text-gray-300">
						Experience the next generation of AI assistance with our
						comprehensive platform
					</p>
				</div>
				<div className="relative z-10 mt-12 flex flex-col gap-3">
					{/* Top row - 3 cards */}
					<div className="flex flex-col gap-3 lg:flex-row">
						{/* First Card - Remove duplicate classes and simplify structure */}
						<Card className="flex-1 p-6 shadow-md">
							<CardContent className="grid gap-6 p-0 sm:grid-cols-2">
								<div className="relative flex aspect-square size-20 rounded-full before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:bg-white/5 dark:before:border-white/5 dark:before:bg-white/5">
									<AICommunicationIcon />
								</div>
								<div className="flex flex-col space-y-3">
									<h2 className="text-lg font-medium text-gray-800 dark:text-white">
										Advanced AI Communication
									</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Seamless text-to-speech and
										speech-to-text capabilities powered by
										OpenAI&apos;s TTS-1 and Whisper-1
										models.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Second Card - Secure by default */}
						<Card className="flex-1 p-6 shadow-md">
							<CardContent className="grid gap-6 p-0 sm:grid-cols-2">
								<div className="relative flex aspect-square size-20 rounded-full before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:bg-white/5 dark:before:border-white/5 dark:before:bg-white/5">
									<AccessibilityIcon />
								</div>
								<div className="flex flex-col space-y-3">
									<h2 className="text-lg font-medium text-gray-800 dark:text-white">
										Enterprise-Grade Accessibility
									</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Full screen reader support, voice
										commands, and ARIA-compliant components
										for universal access.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Third Card - Faster than light */}
						<Card className="flex-1 p-6 shadow-md">
							<CardContent className="grid gap-6 p-0 sm:grid-cols-2">
								<div className="relative flex aspect-square size-20 rounded-full before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:bg-white/5 dark:before:border-white/5 dark:before:bg-white/5">
									<IntelligenceIcon />
								</div>
								<div className="flex flex-col space-y-3">
									<h2 className="text-lg font-medium text-gray-800 dark:text-white">
										Real-Time Intelligence
									</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Streaming responses and intelligent RAG
										system for accurate, context-aware
										interactions.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Bottom row - 2 cards */}
					<div className="flex flex-col gap-3 lg:flex-row">
						{/* Fourth Card - Simplify nested structure */}
						<Card className="flex-1 p-6 shadow-md">
							<CardContent className="grid p-0 sm:grid-cols-2">
									<div className="relative flex aspect-square size-20 rounded-full before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:bg-white/5 dark:before:border-white/5 dark:before:bg-white/5">
										<SmartDatabaseManagementIcon />
								</div>
								<div className="flex flex-col space-y-3">
									<h2 className="text-lg font-medium text-gray-800 dark:text-white">
										Smart Database Management
									</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Advanced filtering, real-time search,
										and comprehensive category organization
										for your data.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Fifth Card */}
						<Card className="flex-1 p-6 shadow-md">
							<CardContent className="grid p-0 sm:grid-cols-2">
									<div className="relative flex aspect-square size-20 rounded-full before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:bg-white/5 dark:before:border-white/5 dark:before:bg-white/5">
										<ModernUIIcon />
									</div>
									<div className="flex flex-col space-y-3">
									<h2 className="text-lg font-medium text-gray-800 dark:text-white">
										Modern UI Architecture
									</h2>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Component-driven design with Shadcn UI,
										dark mode support, and responsive
										Tailwind layouts.
									</p>
									</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
