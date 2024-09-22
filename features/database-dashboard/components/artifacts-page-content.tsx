'use client'

import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserArtifactsStore } from '@/stores/userArtifactsStore';
import { ArtifactsTable } from '@/features/database-dashboard/components/artifacts-table'
import Link from 'next/link'

export default function ArtifactsPageContent({
  searchParams, userId
}: {
  searchParams: { q: string; offset: string };
  userId: string;
}) {
  const { artifacts, isLoading, error, fetchUserArtifacts } = useUserArtifactsStore();
  const search = searchParams.q ?? '';
  const offset = parseInt(searchParams.offset ?? '0', 10);

  useEffect(() => {
    fetchUserArtifacts(userId);
  }, [fetchUserArtifacts, userId]);

  const handleArtifactsChange = () => {
    fetchUserArtifacts(userId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!artifacts) return <div>No artifacts found</div>;

  const filteredArtifacts = artifacts.artefact_tree.filter(artifact =>
    artifact.document_name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedArtifacts = filteredArtifacts.slice(offset, offset + 5);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Shared</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="size-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8">
            <Link href={"/search"} className={"flex gap-1"}>
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
          artifacts={paginatedArtifacts}
          offset={offset}
          totalArtifacts={filteredArtifacts.length}
          userId={userId}
          onArtifactsChange={handleArtifactsChange}
        />
      </TabsContent>
    </Tabs>
  );
}