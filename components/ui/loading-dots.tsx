export function LoadingDots() {
	return (
		<div className="flex items-start justify-start py-4">
			<div className="flex space-x-1">
				{[1, 2, 3].map(dot => (
					<div
						key={dot}
						className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
						style={{
							animationDelay: `${dot * 150}ms`
						}}
					/>
				))}
			</div>
		</div>
	);
}
