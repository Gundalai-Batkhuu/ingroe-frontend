'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtifactsTable } from '@/features/document-collection/components/artifacts-table'
import Link from 'next/link'
import {AllArtifactsTable} from "@/features/document-collection/components/all-artifacts-table";
import { SharedArtifactsTable } from '@/features/document-collection/components/shared-artifacts-table'
import AcceptDocumentSharingRequest from "@/features/document-collection/components/accept-document-sharing-request";

export default function ArtifactsPageContent({
  searchParams,
  userId
}: {
  searchParams: { q: string; offset: string };
  userId: string;
}) {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="shared by you">Shared by you</TabsTrigger>
          <TabsTrigger value="shared to you">Shared to you</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="size-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8">
            <Link href={"/create-knowledge-base"} className={"flex gap-1"}>
              <PlusCircle className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Database
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <ArtifactsTable
          searchParams={searchParams}
          userId={userId}
        />
      </TabsContent>
      <TabsContent value={"raw"}>
        <AllArtifactsTable
         userId={userId}/>
      </TabsContent>
      <TabsContent value={"shared by you"}>
        <SharedArtifactsTable
          searchParams={searchParams}
         userId={userId}/>
      </TabsContent>
      <TabsContent value={"request"}>
        <AcceptDocumentSharingRequest
         userId={userId}/>
      </TabsContent>

    </Tabs>
  );
}