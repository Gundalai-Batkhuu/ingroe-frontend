export function LoadingDots() {
  return (
    <div className="flex justify-start items-start py-4">
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
            style={{
              animationDelay: `${dot * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
} 