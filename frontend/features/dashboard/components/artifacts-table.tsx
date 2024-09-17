'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Artefact } from '@/lib/types'

export function ArtifactsTable({
  artifacts,
  offset,
  totalArtifacts
}: {
  artifacts: Artefact[];
  offset: number;
  totalArtifacts: number;
}) {
  const router = useRouter();

  function prevPage() {
    router.push(`/?offset=${Math.max(0, offset - 5)}`, { scroll: false });
  }

  function nextPage() {
    router.push(`/?offset=${offset + 5}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Databases</CardTitle>
        <CardDescription>
          Manage your knowledge bases and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artifacts.map((artifact) => (
              <TableRow key={artifact.document_id}>
                <TableCell>{artifact.document_name}</TableCell>
                <TableCell>{artifact.description}</TableCell>
                <TableCell>{artifact.files.length}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{offset + 1}-{Math.min(offset + 5, totalArtifacts)}</strong> of <strong>{totalArtifacts}</strong> artifacts
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={offset + 5 >= totalArtifacts}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}