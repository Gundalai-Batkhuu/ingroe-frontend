'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtifactsTable } from '@/features/workers-collection/components/workers-table'
import Link from 'next/link'
import {RawAllArtifactsResponse} from "@/features/workers-collection/components/raw-all-artifacts-response";
import { SharedArtifactsOwnedTable } from '@/features/workers-collection/components/shared-artifacts-owned-table'
import AcceptDocumentSharingRequest from "@/features/workers-collection/components/accept-document-sharing-request";
import {SharedArtifactsLoanedTable} from "@/features/workers-collection/components/shared-artifacts-loaned-table";

interface WorkersTableProps {
    searchParams: { q: string; offset: string };
    userId: string;
    userEmail: string;
}

export default function WorkersPageContent({
  searchParams,
    userId,
    userEmail
}: WorkersTableProps) {
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