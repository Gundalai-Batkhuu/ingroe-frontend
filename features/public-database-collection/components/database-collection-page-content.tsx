'use client';

import React, { useState, useMemo, useEffect } from 'react';
import RedFlame, {
	SearchIcon,
	ListOrderedIcon,
	ChevronDownIcon
} from '@/components/icons';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { marketArtifactsStore } from '@/stores/marketArtifactsStore';

interface Filters {
	category: string[];
	engagement: {
		min: number;
		max: number;
	};
}

type SortOption = 'featured' | 'low' | 'high';

export default function DatabaseCollectionPageContent() {
	const { artifacts, isLoading, error, fetchArtifacts } =
		marketArtifactsStore();
	const [search, setSearch] = useState<string>('');
	const [filters, setFilters] = useState<Filters>({
		category: [],
		engagement: { min: 0, max: 100 }
	});
	const [sort, setSort] = useState<SortOption>('featured');

	useEffect(() => {
		fetchArtifacts();
	}, [fetchArtifacts]);

	const filteredArtifacts = useMemo(() => {
		if (!artifacts) return [];
		return artifacts
			.filter(artifact => {
				const searchValue = search.toLowerCase();
				return (
					artifact.title.toLowerCase().includes(searchValue) ||
					artifact.description.toLowerCase().includes(searchValue)
				);
			})
			.filter(artifact => {
				if (filters.category.length > 0) {
					return filters.category.includes(artifact.category);
				}
				return true;
			})
			.filter(artifact => {
				return (
					artifact.engagement >= filters.engagement.min &&
					artifact.engagement <= filters.engagement.max
				);
			})
			.sort((a, b) => {
				switch (sort) {
					case 'featured':
						return Number(b.featured) - Number(a.featured);
					case 'low':
						return a.engagement - b.engagement;
					case 'high':
						return b.engagement - a.engagement;
					default:
						return 0;
				}
			});
	}, [artifacts, search, filters, sort]);

	const handleCategoryChange = (category: string) => {
		setFilters(prevFilters => ({
			...prevFilters,
			category: prevFilters.category.includes(category)
				? prevFilters.category.filter(c => c !== category)
				: [...prevFilters.category, category]
		}));
	};

	const handleEngagementChange = (minOrMax: 'min' | 'max', value: number) => {
		setFilters(prevFilters => ({
			...prevFilters,
			engagement: {
				...prevFilters.engagement,
				[minOrMax]: value
			}
		}));
	};

	const handleSortChange = (value: string) => {
		if (value === 'featured' || value === 'low' || value === 'high') {
			setSort(value);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!artifacts) return <div>No artifacts available</div>;

	return (
		<div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
			<header className="mb-6">
				<h1 className="mb-2 text-xl font-bold">Database Collection</h1>
				<p className="text-muted-foreground">
					Explore and compare a wide range of database solutions for
					your project.
				</p>
			</header>
			<div className="mb-6">
				<div className="mb-2 flex items-center justify-between">
					<div className="w-1/3">
						<div className="relative flex items-center space-x-2">
							<SearchIcon className="pointer-events-none absolute left-3 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search databases..."
								className="w-full pl-10"
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="flex items-center gap-2"
							>
								<ListOrderedIcon className="h-4 w-4" />
								<span>Sort by</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuRadioGroup
								value={sort}
								onValueChange={handleSortChange}
							>
								<DropdownMenuRadioItem value="featured">
									Featured
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="low">
									Engagement: Low to High
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="high">
									Date: Recent to Old
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Accordion type="single" collapsible>
					<AccordionItem value="filters">
						<AccordionTrigger className="flex w-full items-center justify-between">
							<span>Filters</span>
							<ChevronDownIcon className="h-4 w-4" />
						</AccordionTrigger>
						<AccordionContent>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
								<div>
									<h3 className="mb-2 text-lg font-semibold">
										Category
									</h3>
									<div className="space-y-2">
										{[
											'Government Resources',
											'Social Services',
											'Public Information',
											'Education'
										].map(category => (
											<Label
												key={category}
												className="flex items-center gap-2"
											>
												<Checkbox
													checked={filters.category.includes(
														category
													)}
													onCheckedChange={() =>
														handleCategoryChange(
															category
														)
													}
												/>
												{category}
											</Label>
										))}
									</div>
								</div>
								<div>
									<h3 className="mb-2 text-lg font-semibold">
										Engagement rate
									</h3>
									<div className="space-y-2">
										<div className="flex items-center gap-4">
											<span>Min:</span>
											<Input
												type="number"
												min={0}
												max={filters.engagement.max}
												value={filters.engagement.min}
												onChange={e =>
													handleEngagementChange(
														'min',
														parseInt(e.target.value)
													)
												}
											/>
										</div>
										<div className="flex items-center gap-4">
											<span>Max:</span>
											<Input
												type="number"
												min={filters.engagement.min}
												max={100}
												value={filters.engagement.max}
												onChange={e =>
													handleEngagementChange(
														'max',
														parseInt(e.target.value)
													)
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{filteredArtifacts.map(artifact => (
					<Link href="/chat" prefetch={false} key={artifact.id}>
						<Card
							key={artifact.id}
							className="flex h-full flex-col"
						>
							<CardContent className="flex flex-grow flex-col p-4">
								<div className="flex flex-grow flex-col">
									<div className="mb-2 h-14">
										<Link
											href="#"
											className="line-clamp-2 text-lg font-semibold hover:underline"
											prefetch={false}
										>
											{artifact.title}
										</Link>
									</div>
									<p className="line-clamp-3 flex-grow text-sm text-muted-foreground">
										{artifact.description}
									</p>
								</div>
								<div className="mt-4 flex items-center justify-between">
									<div className="flex items-center font-semibold text-primary">
										<RedFlame />
										<span>{artifact.engagement}</span>
									</div>
									{artifact.featured && (
										<Badge
											variant="secondary"
											className="px-2 py-1 text-xs"
										>
											Featured
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
