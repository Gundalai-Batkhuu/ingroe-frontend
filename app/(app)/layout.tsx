import HeaderContainer from "@/layouts/header-container";
import HeaderContent from "@/layouts/header-content";
import MainArea from "@/layouts/main";
import { DesktopNavbar } from "@/layouts/navbar";

export default function AuthenticatedLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<DesktopNavbar />
			<div className="h-full flex-1 flex-col overflow-x-hidden">
				<HeaderContainer slot={<HeaderContent />} />
				<MainArea>{children}</MainArea>
			</div>
		</>
	);
}
