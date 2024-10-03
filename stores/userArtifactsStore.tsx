import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userService } from '@/services/user-service'
import { UserArtifactsResponse, Artefact, SharedDocument } from '@/lib/types'

interface UserArtifactsState {
  artifacts: UserArtifactsResponse | null
  isLoading: boolean
  error: string | null
  selectedArtifactId: string | null
  fetchUserArtifacts: (userId: string) => Promise<void>
  addArtifact: (artifact: Artefact) => void
  removeArtifact: (artifactId: string) => void
  updateArtifact: (artifact: Artefact) => void
  setSelectedArtifactId: (artifactId: string | null) => void
  addSharedDocument: (sharedDocument: SharedDocument) => void
  removeSharedDocument: (documentId: string) => void
  updateSharedDocument: (updatedDocument: SharedDocument) => void
}

export const userArtifactsStore = create<UserArtifactsState>()(
  persist(
    (set) => ({
      artifacts: null,
      isLoading: false,
      error: null,
      selectedArtifactId: null,

      fetchUserArtifacts: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const data = await userService.getUserArtifacts(userId)
          set((state) => ({
            artifacts: data,
            isLoading: false,
            selectedArtifactId: state.selectedArtifactId || (data.artefact_tree.length > 0 ? data.artefact_tree[0].document_id : null)
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      addArtifact: (artifact: Artefact) => set((state) => ({
        artifacts: state.artifacts
          ? {
              ...state.artifacts,
              artefact_tree: [...state.artifacts.artefact_tree, artifact]
            }
          : null
      })),

      removeArtifact: (artifactId: string) => set((state) => ({
        artifacts: state.artifacts
          ? {
              ...state.artifacts,
              artefact_tree: state.artifacts.artefact_tree.filter((a) => a.document_id !== artifactId)
            }
          : null,
        selectedArtifactId: state.selectedArtifactId === artifactId ? null : state.selectedArtifactId
      })),

      updateArtifact: (updatedArtifact: Artefact) => set((state) => ({
        artifacts: state.artifacts
          ? {
              ...state.artifacts,
              artefact_tree: state.artifacts.artefact_tree.map((a) =>
                a.document_id === updatedArtifact.document_id ? updatedArtifact : a
              )
            }
          : null
      })),

      setSelectedArtifactId: (artifactId: string | null) => set({ selectedArtifactId: artifactId }),

      addSharedDocument: (sharedDocument: SharedDocument) => set((state) => ({
        artifacts: state.artifacts
          ? {
              ...state.artifacts,
              shared_documents_owned: [...(state.artifacts.shared_documents_owned || []), sharedDocument]
            }
          : null
      })),

      removeSharedDocument: (documentId: string) => set((state) => ({
        artifacts: state.artifacts
          ? {
              ...state.artifacts,
              shared_documents_owned: state.artifacts.shared_documents_owned.filter((d) => d.document_id !== documentId)
            }
          : null
      })),

      updateSharedDocument: (updatedDocument: SharedDocument) => set((state) => ({
        artifacts: state.artifacts
          ? {
              ...state.artifacts,
              shared_documents_owned: state.artifacts.shared_documents_owned.map((d) =>
                d.document_id === updatedDocument.document_id ? updatedDocument : d
              )
            }
          : null
      }))
    }),
    {
      name: 'user-artifacts-storage',
      partialize: (state) => ({ selectedArtifactId: state.selectedArtifactId }),
    }
  )
)