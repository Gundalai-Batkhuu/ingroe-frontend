import MainArea from '@/layouts/main';
import HeaderContainer from '@/layouts/header-container';
import MarketingHeaderContent from '@/features/marketing/components/marketing-header';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <div className="h-full flex-1 flex-col overflow-x-hidden">
            <HeaderContainer slot={<MarketingHeaderContent />} />
            <MainArea>{children}</MainArea>
        </div>
    </>
  );
}