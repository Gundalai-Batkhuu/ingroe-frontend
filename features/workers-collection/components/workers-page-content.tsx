'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { AvailableWorkersTable } from '@/features/workers-collection/components/available-workers-table'
import { SharedArtifactsOwnedTable } from '@/features/workers-collection/components/shared-artifacts-owned-table'
import { SharedArtifactsLoanedTable } from '@/features/workers-collection/components/shared-artifacts-loaned-table'
import {RawAllArtifactsResponse} from "@/features/workers-collection/components/raw-all-artifacts-response"
import { useRouter } from 'next/navigation'
interface WorkersPageContentProps {
  searchParams: { q: string; offset: string }
  userId: string
}

export default function WorkersPageContent({
  searchParams,
  userId,
}: WorkersPageContentProps) {
  const tabs = [
    { id: 'available', label: 'Available' },
    { id: 'shared-to-you', label: 'Shared to you' },
    { id: 'shared-by-you', label: 'Shared by you' },
    { id: 'raw', label: 'Raw' },
  ]
  const [activeTab, setActiveTab] = useState('available')
  const router = useRouter()
  return (
    <div className="flex-col space-y-6 py-4 px-5 bg-background rounded-lg h-full">
      {/* Header Section */}
      <div className="items-center justify-between flex">
        <div>
          <h1 className="text-2xl font-semibold">Workers Hub</h1>
          <p className="text-sm text-muted-foreground">Manage workers</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {/* Add more filter options */}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            01 Mar 2024 - 10 Nov 2024
          </Button>

          <Button className="gap-2" onClick={() => router.push('/create-worker')}>
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-2 pb-1 text-sm font-medium transition-colors hover:text-primary',
                {
                  'border-b-2 border-brand-green text-brand-green': activeTab === tab.id,
                  'text-muted-foreground': activeTab !== tab.id,
                }
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Section */}
      <div className="h-[calc(100%-8rem)]">
        {activeTab === 'available' && (
          <AvailableWorkersTable searchParams={searchParams} userId={userId} />
        )}
        {activeTab === 'shared-by-you' && (
          <SharedArtifactsOwnedTable searchParams={searchParams} userId={userId} />
        )}
        {activeTab === 'shared-to-you' && (
          <SharedArtifactsLoanedTable searchParams={searchParams} userId={userId} />
        )}
        {activeTab === 'raw' && (
          <RawAllArtifactsResponse userId={userId} />
        )}
      </div>
    </div>
  )
}