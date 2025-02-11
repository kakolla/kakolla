import React from "react";


interface Props {
    pageState: string;
}
function Home({ pageState }: Props) {
    if (pageState === "home") {
        return <div className="highlighted-text animate-fade absolute top-2/3 left-20  text-white overflow-y-auto no-scrollbar bottom-10">
            <h1 className="text-2xl">Hi there, I'm <p className="inline text-lime-600">Abi</p></h1>
            <h1 className="pt-4 max-w-xl">I'm a Computer Science student at USC enthusiastic about
                machine learning, neuroscience, and developing creative solutions to real-world problems.
            </h1>
            <h1 className="pt-4 max-w-xl">
                I'm currently performing research at the Center for Neural Engineering @ USC and exploring GraphRAG-based pipelines for better LLM contextual accuracy.
            </h1>






        </div>
    }




}


export default React.memo(Home);