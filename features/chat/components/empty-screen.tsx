export function EmptyScreen() {
	return (
		<div className="mx-auto max-w-2xl flex-1 p-4">
			<div className="rounded-lg border bg-background p-8">
				<h1 className="text-lg font-semibold">
					Welcome to AI Chatbot!
				</h1>
				<p className="mt-2 text-muted-foreground">
					Get started by selecting a document and typing your message
					below.
				</p>
			</div>
		</div>
	);
}
