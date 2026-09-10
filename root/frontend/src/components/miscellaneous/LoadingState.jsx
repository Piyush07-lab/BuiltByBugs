function LoadingState({ label = "Loading data..." }) {
    return (
        <div className="flex h-full flex-1 items-center justify-center py-8">
            <p className="text-xs font-medium text-muted animate-pulse">{label}</p>
        </div>
    );
}

export default LoadingState;
