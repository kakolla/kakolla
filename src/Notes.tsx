interface Props {
    pageState: string;
}

function Notes({ pageState }: Props) {
    if (pageState !== "notes") return null;

    return (
        <>
            <div className="animate-fade absolute inset-0 z-2 backdrop-blur-sm bg-black/30">
            </div>
            <div className="fixed top-20 left-1/2 h-[80vh] transform -translate-x-1/2
            max-w-3xl w-full p-8 rounded-lg overflow-y-auto animate-fade no-scrollbar">

                <div className="text-white">
                    <h1 className="text-xl font-semibold text-center mb-6">
                        a place for my notes and experiments
                    </h1>
                    <p className="mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur facilisis.
                    </p>
                    <p className="mb-4">
                        More text goes here. This will scroll when the content exceeds the viewport.
                    </p>
                    <p className="mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                    <p className="mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                    <p className="mb-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>

            </div>

        </>

        // <></>
    );
}

export default Notes;
