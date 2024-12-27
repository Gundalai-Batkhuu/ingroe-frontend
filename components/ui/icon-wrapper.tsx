import { useState } from 'react';

export const IconWrapper = ({
	children,
	tooltip
}: {
	children: React.ReactNode;
	tooltip: string;
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{children}
			{isHovered && (
				<span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
					{tooltip}
				</span>
			)}
		</div>
	);
};
