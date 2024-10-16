import { create } from 'zustand'
import {ResourceItem} from "@/features/document-creation/lib/types";


interface ResourceItemsState {
  resourceItems: ResourceItem[]
  addResourceItem: (type: 'file' | 'link' | 'note', content: File | string) => void
  removeResourceItem: (id: string) => void
  clearResourceItems: () => void
}

export const useResourceItemsStore = create<ResourceItemsState>((set) => ({
  resourceItems: [],
  addResourceItem: (type, content) => set((state) => ({
    resourceItems: [...state.resourceItems, 
      type === 'link'
        ? { id: Date.now().toString(), type, content: content as string, displayName: content as string }
        : { id: Date.now().toString(), type, content: content as File, displayName: (content as File).name }
    ]
  })),
  removeResourceItem: (id) => set((state) => ({
    resourceItems: state.resourceItems.filter(item => item.id !== id)
  })),
  clearResourceItems: () => set({ resourceItems: [] })
}))
