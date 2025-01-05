import { create } from 'zustand';
import { MarketArtifact } from '@/lib/types';

interface UserArtifactsState {
	artifacts: MarketArtifact[] | null;
	isLoading: boolean;
	error: string | null;
	selectedArtifactId: number | null;
	fetchArtifacts: () => Promise<void>;
	addArtifact: (artifact: MarketArtifact) => void;
	removeArtifact: (artifactId: number) => void;
	updateArtifact: (artifact: MarketArtifact) => void;
	setSelectedArtifactId: (artifactId: number | null) => void;
}

export const marketArtifactsStore = create<UserArtifactsState>(set => ({
	artifacts: null,
	isLoading: false,
	error: null,
	selectedArtifactId: null,

	fetchArtifacts: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await fetch('/api/knowledge-bases');
			if (!response.ok) throw new Error('Failed to fetch artifacts');
			const data = await response.json();
			set({ artifacts: data.knowledge_base, isLoading: false });
		} catch (error) {
			set({ error: (error as Error).message, isLoading: false });
		}
	},

	addArtifact: (artifact: MarketArtifact) =>
		set(state => ({
			artifacts: state.artifacts
				? [...state.artifacts, artifact]
				: [artifact]
		})),

	removeArtifact: (artifactId: number) =>
		set(state => ({
			artifacts: state.artifacts
				? state.artifacts.filter(art => art.id !== artifactId)
				: null,
			selectedArtifactId:
				state.selectedArtifactId === artifactId
					? null
					: state.selectedArtifactId
		})),

	updateArtifact: (updatedArtifact: MarketArtifact) =>
		set(state => ({
			artifacts: state.artifacts
				? state.artifacts.map(art =>
						art.id === updatedArtifact.id ? updatedArtifact : art
					)
				: null
		})),

	setSelectedArtifactId: (artifactId: number | null) =>
		set({ selectedArtifactId: artifactId })
}));
