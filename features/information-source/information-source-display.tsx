import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { IconWrapper } from "@/components/ui/icon-wrapper";
  import { FileText } from "lucide-react";

const dummyInformationSource = {
    "document_id": "a1d19d6e53244dfc9c4b134078352705",
    "query": "What is the tour itenary review?",
    "response": {
        "answer": "The tour itinerary includes 3 nights in Kathmandu for sightseeing and exploring, and 2 nights in Pokhara for sightseeing and exploring.",
        "chunkid": [
            "Nepal-on-a-budget-5-nts.pdf:0:1"
        ],
        "context": [
            {
                "id": null,
                "metadata": {
                    "chunkid": "Nepal-on-a-budget-5-nts.pdf:0:1",
                    "document_id": "a1d19d6e53244dfc9c4b134078352705",
                    "file_name": "Nepal-on-a-budget-5-nts.pdf",
                    "page": 0,
                    "source": "D:\\New\\VisualStudio\\ingroe-backend\\app\\files\\1730115258895.pdf",
                    "type": "file",
                    "user_id": "123"
                },
                "page_content": "Introduction \nThis short introductory tour can be taken any day of the year, subject to availability. The best mo nths for these destinations \nare October to early June.  \nTour Itinerary Overview \n3 nts Kathmandu – sightseeing & exploring.  \n2 nts Pokhara – sightseeing & exploring.   \nWhy Book With Bhutan & Beyond? \n• 20 years experience, service & knowledge in the South Asia region.  \n• We personally visit these regions annually. (COVID -19 exempt)",
                "type": "Document"
            },
            {
                "id": null,
                "metadata": {
                    "chunkid": "Nepal-on-a-budget-5-nts.pdf:2:4",
                    "document_id": "a1d19d6e53244dfc9c4b134078352705",
                    "file_name": "Nepal-on-a-budget-5-nts.pdf",
                    "page": 2,
                    "source": "D:\\New\\VisualStudio\\ingroe-backend\\app\\files\\1730115258895.pdf",
                    "type": "file",
                    "user_id": "123"
                },
                "page_content": "the rising sun.  \nThis afternoon, continue with sightseeing tour of Pokhara cit y and its colourful  bazaars. Visit includes Bindabasini temple \nand Devi’s fall. Take a walk along the Phewa lakeside with its rows o f restaurants, bars, bookshops,  and fruit stalls. After \nthe visit, drive back to your hotel.  \nOvernight at Hotel Lake Palace or similar.  \n \nDay 05: \nDrive Pokhara / K athmandu (200 km/5 hrs). Tour of Patan (B)",
                "type": "Document"
            },
            {
                "id": null,
                "metadata": {
                    "chunkid": "Nepal-on-a-budget-5-nts.pdf:0:0",
                    "document_id": "a1d19d6e53244dfc9c4b134078352705",
                    "file_name": "Nepal-on-a-budget-5-nts.pdf",
                    "page": 0,
                    "source": "D:\\New\\VisualStudio\\ingroe-backend\\app\\files\\1730115258895.pdf",
                    "type": "file",
                    "user_id": "123"
                },
                "page_content": "Nepal On A Budget Private Tour – 6 days/5 nights  \n \n \n \n________________  \n \n \n  All travel referred to on this site is arranged through James & Nicola Irvi ng t/a Bhutan & Beyond, \naffiliated with MTA Travel.  MTA – Mobile Travel Agents is a member of Virtuoso, AFTA, ATAS and \nIATA accredited . \nT: 1300 367 875 (toll free) T: 07 5661 1605 . \nPO Box 691, Robina DC, QLD 4226, Australia  \nE: enquiries@bhutan.com.au    W: www.bhutan.com.au  \n \nIntroduction",
                "type": "Document"
            }
        ]
    }
}

interface InformationSourceDisplayProps {
}

export default function InformationSourceDisplay({ }: InformationSourceDisplayProps) {
    return (
        <Dialog>
            <DialogTrigger>
                <div>
                    <IconWrapper tooltip='Source'>
                        <FileText className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    </IconWrapper>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Information Source</DialogTitle>
                    <DialogDescription>
                        {dummyInformationSource.response.answer}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {dummyInformationSource.response.context.map((context, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4" />
                                <p className="text-sm font-medium">
                                    {context.metadata.file_name} (Page {context.metadata.page + 1})
                                </p>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                                {context.page_content}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Source: {context.metadata.source}
                            </p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}