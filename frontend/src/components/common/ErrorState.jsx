export function ErrorState({ message = "Error loading data." }) {
    return (
        <div className="bg-[#313131] flex flex-col flex-1 rounded-[20px] shadow-2xl relative justify-center items-center">
            <div className="text-red-500 text-2xl">{message}</div>
        </div>
    );
}