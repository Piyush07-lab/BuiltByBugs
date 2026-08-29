function ErrorState({ label = "Unable to load data." }) {
    return <p className="mt-6 leading-relaxed text-red-300">{label}</p>;
}

export default ErrorState;
