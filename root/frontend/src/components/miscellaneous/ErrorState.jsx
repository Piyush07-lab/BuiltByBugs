function ErrorState({ label = "Unable to load data." }) {
    return (
        <div className="flex h-full flex-1 items-center justify-center py-8">
            <p className="text-xs font-medium text-red-300">{label}</p>
        </div>
    );
}

export default ErrorState;
