import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { SecurityIcon, ApiIntegrationIcon, DocumentationIcon, TrainingProgramsIcon } from "./icons"

export default function FourthSectionContent() {
    return (
        <div className="mx-auto max-w-6xl px-6">
							<div className="grid items-center gap-12 md:grid-cols-2 md:gap-0 lg:gap-12">
								<div className="lg:pr-24">
									<div className="md:pr-6 lg:pr-0">
										<h2 className="text-title text-3xl font-semibold">
											Enterprise-grade support for seamless integration
										</h2>
										<p className="text-body mt-6">
											Our dedicated customer engineering team ensures successful adoption with:
										</p>
									</div>
									<ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
										<li>
											<svg
												className="size-5"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
											>
												<g
													fill="none"
													stroke="currentColor"
													strokeWidth="1.5"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="m7 9l5 3.5L17 9"
													/>
													<path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
												</g>
											</svg>
											24/7 Technical Support
										</li>
										<li>
											<svg
												className="size-5"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
											>
												<path
													fill="currentColor"
													d="M8 9.5A1.25 1.25 0 1 0 8 12a1.25 1.25 0 0 0 0-2.5m4 0a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5m2.75 1.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0"
												/>
												<path
													fill="currentColor"
													fillRule="evenodd"
													d="M16.1 4.593a50.577 50.577 0 0 0-8.098-.04l-.193.015A4.93 4.93 0 0 0 3.25 9.483V18a.75.75 0 0 0 1.105.66l3.91-2.101a1.25 1.25 0 0 1 .593-.149h8.976c1.132 0 2.102-.81 2.305-1.923c.412-2.257.444-4.567.096-6.835l-.102-.669a2.666 2.666 0 0 0-2.408-2.252zM8.116 6.049a49.078 49.078 0 0 1 7.858.038l1.624.139c.536.046.972.453 1.053.985l.103.668a19.165 19.165 0 0 1-.09 6.339a.843.843 0 0 1-.829.692H8.858a2.75 2.75 0 0 0-1.302.328L4.75 16.746V9.483a3.43 3.43 0 0 1 3.171-3.42z"
													clipRule="evenodd"
												/>
											</svg>
											Dedicated Integration Specialists
										</li>
										<li>
											<svg
												className="size-5"
												xmlns="http://www.w3.org/2000/svg"
												width="1em"
												height="1em"
												viewBox="0 0 14 14"
											>
												<path
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M.5 7.08h2.19a.52.52 0 0 0 .45-.27l1.8-3.6a.49.49 0 0 1 .49-.27a.48.48 0 0 1 .43.35l2.23 7.42a.5.5 0 0 0 .46.36a.5.5 0 0 0 .45-.32l1.37-3.35a.51.51 0 0 1 .47-.32h2.66"
												/>
											</svg>
											Proactive System Monitoring
										</li>
										<li>
											<svg
												className="size-5"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
											>
												<path
													fill="currentColor"
													d="m6.75 21l-.25-2.2l2.85-7.85q.375.35.813.588t.937.362l-2.75 7.55zm10.5 0l-1.6-1.55l-2.75-7.55q.5-.125.938-.363t.812-.587l2.85 7.85zM12 11q-1.25 0-2.125-.875T9 8q0-.975.563-1.737T11 5.2V3h2v2.2q.875.3 1.438 1.063T15 8q0 1.25-.875 2.125T12 11m0-2q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9"
												/>
											</svg>
											Custom Integration Planning
										</li>
									</ul>
								</div>
								<Card className="h-full overflow-hidden p-3">
										<div className="flex gap-2 p-6 *:size-2.5 *:rounded-full">
											<div className="bg-[#f87171]"></div>
											<div className="bg-[#fbbf24]"></div>
											<div className="bg-[#a3e635]"></div>
										</div>
										<div className="grid grid-cols-2 gap-4 px-6 py-8">
											<Card className="p-6">
												<SecurityIcon />
												<h3 className="font-semibold">Security Compliance</h3>
												<p className="text-sm text-muted-foreground mt-2">
													SOC 2 Type II certified infrastructure with enterprise-grade security controls
												</p>
											</Card>
											<Card className="p-6">
												<ApiIntegrationIcon />
												<h3 className="font-semibold">API Integration</h3>
												<p className="text-sm text-muted-foreground mt-2">
													Dedicated technical support for custom API implementations and webhooks
												</p>
											</Card>
											<Card className="p-6">
												<DocumentationIcon />
												<h3 className="font-semibold">Comprehensive Documentation</h3>
												<p className="text-sm text-muted-foreground mt-2">
													Detailed implementation guides and API references with code samples
												</p>
											</Card>
											<Card className="p-6">
												<TrainingProgramsIcon />
												<h3 className="font-semibold">Training Programs</h3>
												<p className="text-sm text-muted-foreground mt-2">
													Onboarding sessions and technical workshops for your engineering team
												</p>
											</Card>
										</div>
									</Card>
							</div>
						</div>
    )
}