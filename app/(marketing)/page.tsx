import MarketingFooter from '@/features/marketing/components/marketing-footer';
import FirstSectionContent from '@/features/marketing/components/first-section';
import SecondSectionContent from '@/features/marketing/components/second-section';
import ThirdSectionContent from '@/features/marketing/components/third-section';
import FourthSectionContent from '@/features/marketing/components/fourth-section';

export default async function MarketingPage() {
	return (
		<div className="bg-white dark:bg-gray-950">
			<div className="overflow-hidden">
				{/* First Section */}
				<section className="relative">
					<div className="relative pt-24 lg:pt-28">
						<FirstSectionContent />
					</div>
				</section>

				{/* Second Section */}
				<section>
					<div className="pt-40">
						<SecondSectionContent />
					</div>
				</section>

				{/* Third Section */}
				<section>
					<div className="pt-40">
						<ThirdSectionContent />
					</div>
				</section>

				<section>
					<div className="py-40">
						<FourthSectionContent />
					</div>
				</section>
			</div>
		</div>
	);
}
