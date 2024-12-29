import { useCallback, useEffect, useRef, useState } from 'react';

export const useScrollAnchor = () => {
	// Refs to track different DOM elements
	const messagesRef = useRef<HTMLDivElement>(null); // References the end of messages list
	const scrollRef = useRef<HTMLDivElement>(null); // References the scrollable container
	const visibilityRef = useRef<HTMLDivElement>(null); // References element to observe visibility

	// State to track scroll and visibility conditions
	const [isAtBottom, setIsAtBottom] = useState(true); // Tracks if viewport is at bottom
	const [isVisible, setIsVisible] = useState(false); // Tracks if target element is visible

	// Utility function to smoothly scroll to bottom
	const scrollToBottom = useCallback(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollIntoView({
				block: 'end',
				behavior: 'smooth' // Enables smooth animation
			});
		}
	}, []);

	// Auto-scroll effect: Scrolls to bottom when conditions are met
	useEffect(() => {
		if (messagesRef.current) {
			// Only auto-scroll if we're at bottom and content isn't visible
			if (isAtBottom && !isVisible) {
				messagesRef.current.scrollIntoView({
					block: 'end' // Instant scroll without animation
				});
			}
		}
	}, [isAtBottom, isVisible]);

	// Scroll position tracking effect
	useEffect(() => {
		const { current } = scrollRef;

		if (current) {
			const handleScroll = (event: Event) => {
				const target = event.target as HTMLDivElement;
				const offset = 25; // Threshold to consider "bottom" (in pixels)

				// Calculate if we're at bottom considering the offset
				const isAtBottom =
					target.scrollTop + target.clientHeight >=
					target.scrollHeight - offset;

				setIsAtBottom(isAtBottom);
			};

			// Add scroll listener with passive flag for better performance
			current.addEventListener('scroll', handleScroll, {
				passive: true
			});

			// Cleanup listener on unmount
			return () => {
				current.removeEventListener('scroll', handleScroll);
			};
		}
	}, []);

	// Visibility observer effect
	useEffect(() => {
		if (visibilityRef.current) {
			// Create intersection observer to track element visibility
			let observer = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						// Update visibility state based on intersection
						if (entry.isIntersecting) {
							setIsVisible(true);
						} else {
							setIsVisible(false);
						}
					});
				},
				{
					// Adjust root margin to trigger before element is fully visible
					rootMargin: '0px 0px -150px 0px'
				}
			);

			// Start observing the target element
			observer.observe(visibilityRef.current);

			// Cleanup observer on unmount
			return () => {
				observer.disconnect();
			};
		}
	});

	// Return refs and utilities for component use
	return {
		messagesRef, // Attach to bottom of messages list
		scrollRef, // Attach to scrollable container
		visibilityRef, // Attach to visibility trigger element
		scrollToBottom, // Function to manually scroll to bottom
		isAtBottom, // Boolean indicating if viewport is at bottom
		isVisible // Boolean indicating if target element is visible
	};
};
