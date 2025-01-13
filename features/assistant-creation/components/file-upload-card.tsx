import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUploader } from './file-uploader';
import HandwrittenNotesEditor from '@/features/handwriting-recognition/components/handwritten-notes-content';
import WebSearchContainer from '@/features/google-search/components/web-search-container';

interface FileUploadCardProps {
	userId: string;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	onFileUpload: (files: File[]) => void;
}

const tabs = [
	{ id: 'file', label: 'Files' },
	{ id: 'web-links', label: 'Web Links' },
	{ id: 'electronics', label: 'Electronic Files' }
];

export function FileUploadCard({
	userId,
	activeTab,
	setActiveTab,
	onFileUpload
}: FileUploadCardProps) {
	return (
		<Card className="h-full w-3/4 border-0 shadow-none">
			<CardContent className="flex flex-col px-6">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="flex h-full w-full flex-col"
				>
					<TabsList className="flex justify-start space-x-8 bg-transparent">
						{tabs.map(tab => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="px-2 pb-1 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-brand-green data-[state=inactive]:text-muted-foreground"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					<div className="mt-4 flex-1">
						<TabsContent className="h-full" value="file">
							<FileUploader onFileUpload={onFileUpload} />
						</TabsContent>
						<TabsContent className="h-full" value="electronics">
							<div />
						</TabsContent>
						{/* <TabsContent className="h-full" value="note">
                            <HandwrittenNotesEditor userId={userId} />
                        </TabsContent> */}
						<TabsContent className="h-full" value="web-links">
							<WebSearchContainer userId={userId} />
						</TabsContent>
					</div>
				</Tabs>
			</CardContent>
		</Card>
	);
}
