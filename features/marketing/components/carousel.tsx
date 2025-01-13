'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';
import { AstroIcon, NetlifyIcon, WorkOSIcon } from './icons';
import Autoplay from 'embla-carousel-autoplay';
import { Card } from '@/components/ui/card';

export function CarouselComponent() {
	const plugin = Autoplay({ delay: 100000, stopOnInteraction: false });

	return (
		<div className="relative -mx-6 mt-8 max-w-xl sm:mx-auto sm:mt-12">
			<div className="absolute inset-0 -top-8 left-1/2 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10"></div>
			<div className="absolute inset-x-0 top-12 mx-auto h-1/3 w-2/3 rounded-full bg-brand-green blur-3xl dark:bg-white/20"></div>

			<Carousel
				plugins={[plugin]}
				className="w-full"
				opts={{
					align: 'start',
					loop: true
				}}
			>
				<CarouselContent>
					<CarouselItem className="px-6 pb-12 pt-2">
						<Card className="rounded-xl bg-white p-9 shadow-lg">
							<div>
								<NetlifyIcon />
								<p className="mt-6 text-center text-lg">
									30% Increase in revenue
								</p>
							</div>
						</Card>
					</CarouselItem>

					<CarouselItem className="px-6 pb-12 pt-2">
						<Card className="rounded-xl bg-white p-9 shadow-lg">
							<div>
								<AstroIcon />
								<p className="mt-6 text-center text-lg">
									30% Increase in work
								</p>
							</div>
						</Card>
					</CarouselItem>

					<CarouselItem className="px-6 pb-12 pt-2">
						<Card className="rounded-xl bg-white p-9 shadow-lg">
							<div>
								<div className="mx-auto h-12 w-fit">
									<WorkOSIcon />
								</div>
								<p className="mt-6 text-center text-lg">
									30% Increase in speed
								</p>
							</div>
						</Card>
					</CarouselItem>
				</CarouselContent>
			</Carousel>
		</div>
	);
}
