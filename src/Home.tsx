import React from "react";


interface Props {
    pageState: string;
}
function Home({ pageState }: Props) {
    if (pageState === "home") {
        return <div className="highlighted-text animate-fade absolute top-2/3 left-20  
        text-white overflow-y-auto no-scrollbar bottom-10
        max-md:w-3/4 max-md:bottom-10">
            <h1 className="text-2xl">Hi there, I'm <p className="inline text-[#D2A8FF]">Abi 👽</p></h1>
            <h1 className="pt-4 max-w-xl">I'm a Computer Science student at USC enthusiastic about
                machine learning, neuroscience, and distributed systems.
            </h1>
            <h1 className="pt-4 max-w-xl">
                I'm currently working on ML infrastructure and FinOps-focused data engineering systems at 
                <p className="inline text-sky-600"> 
                <a href="https://stitcher.ai/" target="_blank"> StitcherAI</a></p>, and 
                researching graph-based LLM reasoning at the <p className="inline text-sky-600">
                <a href="https://itemsusc.org/" target="_blank">
                Center for Neural 
                Engineering @ USC
                </a></p>
            </h1>






        </div>
    }




}


export default React.memo(Home);