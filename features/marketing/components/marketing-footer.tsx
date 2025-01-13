import Logo from '@/layouts/logo';
import Link from 'next/link';

export default function MarketingFooterContent() {
	return (
			<div className="mx-auto max-w-6xl space-y-16 px-6 py-10">
			
				<div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
					<div>
						<span className="text-sm font-medium text-gray-950 dark:text-white">
							Company
						</span>
						<ul className="mt-4 list-inside space-y-4">
							<li>
								<Link
									href="/about"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<span className="text-sm font-medium text-gray-950 dark:text-white">
							Solutions
						</span>
						<ul className="mt-4 list-inside space-y-4">
							<li>
								<Link
									href="/features"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="/integrations"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Integrations
								</Link>
							</li>
							<li>
								<Link
									href="/pricing"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									href="/enterprise"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Enterprise
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<span className="text-sm font-medium text-gray-950 dark:text-white">
							Resources
						</span>
						<ul className="mt-4 list-inside space-y-4">
							<li>
								<Link
									href="/docs"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Documentation
								</Link>
							</li>
							<li>
								<Link
									href="/api"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									API Reference
								</Link>
							</li>
							<li>
								<Link
									href="/changelog"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Changelog
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<span className="text-sm font-medium text-gray-950 dark:text-white">
							Support
						</span>
						<ul className="mt-4 list-inside space-y-4">
							<li>
								<Link
									href="/help"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									href="https://discord.com"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Community
								</Link>
							</li>
						</ul>

						<div className="mt-12">
							<h3 className="text-sm font-medium text-gray-950 dark:text-white">
								Subscribe to our newsletter
							</h3>
							<form className="mt-4 flex flex-col gap-2 sm:flex-row">
								<input
									type="email"
									placeholder="Enter your email"
									className="h-10 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
									required
								/>
								<button
									type="submit"
									className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									Subscribe
									<svg
										className="ml-2 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</form>
						</div>
					</div>
					<div>
						<span className="text-sm font-medium text-gray-950 dark:text-white">
							Privacy & Terms
						</span>
						<ul className="mt-4 list-inside space-y-4">
							<li>
								<Link
									href="/privacy"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-primary-600 dark:hover:text-primary-500 text-sm text-gray-600 dark:text-gray-400"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="card variant-soft flex items-center justify-between rounded-md px-6 py-3">
                    <span className="text-sm font-medium text-gray-950 dark:text-white">
                         Ingroe © {new Date().getFullYear()}
                    </span>
                    <div className="flex gap-3">
						<Link
							href="https://github.com/tailus-ui"
							target="blank"
							aria-label="github"
							className="text-body hover:text-primary-600 dark:hover:text-primary-500 flex size-8 *:m-auto"
						>
							<svg
								className="size-5"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
							</svg>
						</Link>
						<Link
							href="https://youtube.com/@tailus-ui"
							target="blank"
							aria-label="medium"
							className="hover:text-primary-600 dark:hover:text-primary-500 flex size-8 rounded-[--btn-border-radius] text-gray-600 *:m-auto dark:text-gray-400"
						>
							<svg
								className="size-5"
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
								/>
							</svg>
						</Link>
					</div>
                </div>
			</div>
	);
}
