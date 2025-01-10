import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkerCreationButton } from '@/features/assistant-creation/components/worker-creation-button';
import { useResourceItemsStore } from '@/features/assistant-creation/stores/useResourceItemsStore';
import { FileText, FileSpreadsheet, File, Link, PenTool, Trash2 } from 'lucide-react';

interface UploadedFilesCardProps {
    userId: string;
    title: string;
    description: string;
}

export function UploadedFilesCard({ userId, title, description }: UploadedFilesCardProps) {
    const { resourceItems, removeResourceItem, clearResourceItems } = useResourceItemsStore();

    return (
        <Card className="flex h-full w-1/4 flex-col">
            <CardHeader>
                <CardTitle>Uploaded files</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <ul className="space-y-2">
                        {resourceItems.map(resource => (
                            <li
                                key={resource.id}
                                className="flex items-center justify-between py-1.5"
                            >
                                <span className="flex items-center text-sm">
                                    {resource.type === 'file' && (
                                        <>
                                            {/\.(pdf)$/i.test(resource.displayName) && (
                                                <FileText className="mr-2 size-6 text-gray-600" />
                                            )}
                                            {/\.(xlsx|xls)$/i.test(resource.displayName) && (
                                                <FileSpreadsheet className="mr-2 size-6 text-gray-600" />
                                            )}
                                            {/\.(docx|md|txt)$/i.test(resource.displayName) && (
                                                <File className="mr-2 size-6 text-gray-600" />
                                            )}
                                            {!/\.(pdf|xlsx|xls|docx|md|txt)$/i.test(resource.displayName) && (
                                                <File className="mr-2 size-6 text-gray-600" />
                                            )}
                                        </>
                                    )}
                                    {resource.type === 'link' && (
                                        <Link className="mr-2 size-4 text-gray-600" />
                                    )}
                                    {resource.type === 'note' && (
                                        <PenTool className="mr-2 size-4 text-gray-600" />
                                    )}
                                    <span className="mx-2 text-gray-900">
                                        {resource.displayName}
                                    </span>
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeResourceItem(resource.id)}
                                    aria-label={`Remove ${resource.type}`}
                                    className="size-6 pl-2 hover:bg-transparent"
                                >
                                    <Trash2 className="size-4 text-gray-400 transition-colors hover:text-red-500" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between gap-4 p-4">
                <Button
                    variant="outline"
                    onClick={clearResourceItems}
                    disabled={resourceItems.length === 0}
                    className="flex-1"
                >
                    Clear All
                </Button>
                <WorkerCreationButton
                    userId={userId}
                    title={title}
                    description={description}
                    className="flex-1"
                />
            </CardFooter>
        </Card>
    );
} 