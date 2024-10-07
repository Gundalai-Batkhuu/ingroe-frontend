'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtifactsTable } from '@/features/document-collection/components/artifacts-table'
import Link from 'next/link'
import {RawAllArtifactsResponse} from "@/features/document-collection/components/raw-all-artifacts-response";
import { SharedArtifactsOwnedTable } from '@/features/document-collection/components/shared-artifacts-owned-table'
import AcceptDocumentSharingRequest from "@/features/document-collection/components/accept-document-sharing-request";
import {SharedArtifactsLoanedTable} from "@/features/document-collection/components/shared-artifacts-loaned-table";

interface ArtifactsTableProps {
    searchParams: { q: string; offset: string };
    userId: string;
    userEmail: string;
}

export default function ArtifactsPageContent({
  searchParams,
    userId,
    userEmail
}: ArtifactsTableProps) {
  return (
    <Tabs defaultValue="owned">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="owned">Owned</TabsTrigger>
          <TabsTrigger value="shared by you">Shared by you</TabsTrigger>
            <TabsTrigger value="shared to you">Shared to you</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="raw">Raw artifacts response</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="size-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8">
            <Link href={'/create-knowledge-base'} className={'flex gap-1'}>
              <PlusCircle className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Database
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="owned">
        <ArtifactsTable searchParams={searchParams} userId={userId} />
      </TabsContent>

      <TabsContent value={'shared by you'}>
        <SharedArtifactsOwnedTable
          searchParams={searchParams}
          userId={userId}
        />
      </TabsContent>
      <TabsContent value={'shared to you'}>
        <SharedArtifactsLoanedTable
          searchParams={searchParams}
          userId={userId}
        />
      </TabsContent>
      <TabsContent value={'request'}>
        <AcceptDocumentSharingRequest userId={userId} userEmail={userEmail} />
      </TabsContent>
        <TabsContent value={'raw'}>
            <RawAllArtifactsResponse userId={userId} />
        </TabsContent>
    </Tabs>
  )
}