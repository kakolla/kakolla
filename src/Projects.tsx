import { useEffect, useRef, useState } from "react";
import ProjectBlurb from "./ProjectBlurb";


interface Props {
    projCount: number;
    setProjCountFunction: any
}

function Projects({ projCount, setProjCountFunction }: Props) {
    let texts: string[] = [];
    let headers: string[] = [];
    let links: string[] = [];

    const [visibleComponentIndex, setVisibleComponentIndex] = useState<number>(projCount); // index of current visible component

    let containerRef = useRef<HTMLDivElement>(null);

    if (containerRef.current) {
        containerRef.current.scrollTop = 0;
    }


    headers.push("ML Researcher @ USC CNE");
    texts.push(`
        Modeled in-silico layers of the Hippocampus used to generate a dendritic tree as part of a neural network. 
        Also developed algorithms to grid large datasets and implemented unsupervised learning techniques to reduce tree generation time.
        
        `);
    links.push("https://github.com/NESCOM-Lab/2D-Hippocampus-Voxel-Coordinate-Visualization");

    headers.push("CleanSweep @ HackHarvard (Winner)");
    texts.push(`
        In a team, developed a smart city waste management platform that calculated optimized collection routes for sanitation trucks.
        Used Computer Vision techniques to detect real-time trash levels that were sent to a Raspberry Pi server.
        Implemented a Random Forest Classifier model in Databricks to make predictions, deployed on Terraform.
                
        `);
    links.push("https://devpost.com/software/cleansweep-tjq36w");

    headers.push("HybridRAG pipeline for neuroscience-based text citation");
    texts.push(`
        Developing a Hybrid Retrieval-Augmented Generation (RAG) pipeline for research faculty integrating Graph retrieval agents
        with Neo4j and LangChain, and vector-based agents with Pinecone, to enable neuroscience-focused text and citation generation. Panel 
        shown is a picture of the Graph database.

        `);
    links.push("https://github.com/NESCOM-Lab/knowledgegraphs");


    headers.push("Mystical Memories - ROBLOX Game Jam winner 2024");
    texts.push(`
        Developed a memory training minigame in a team using a memory palace concept.
        Programmed the game AI physics using Coroutines and Tweening for smooth animations. 
        Designed and created the game models, environment, and post-processing effects.
                
        `);
    links.push("https://www.roblox.com/games/17043959296/Mystical-Memories-The-Genies-Challenge");

    headers.push("Scribo");
    texts.push(`
        Developed a light-view email viewing client that classifies emails as important using a Gaussian Naive Bayes Classifier.
        Feature-engineered using self-selected parameters and trained using 2 months worth of supervised email data.
                
        `);
    links.push("https://github.com/kakolla/Scribo");




    // return <div ref={containerRef} className="highlighted-text w-1/3 animate-fade absolute top-1/3 left-20 text-white overflow-y-auto no-scrollbar bottom-10">

    //     <ProjectBlurb header={headers[0]} text={texts[0]} link={links[0]} addSpace={false}></ProjectBlurb>
    //     <ProjectBlurb header={headers[1]} text={texts[1]} link={links[1]} addSpace={true}></ProjectBlurb>
    //     <ProjectBlurb header={headers[2]} text={texts[2]} link={links[2]} addSpace={true}></ProjectBlurb>
    //     <ProjectBlurb header={headers[3]} text={texts[3]} link={links[3]} addSpace={true}></ProjectBlurb>
    //     <ProjectBlurb header={headers[4]} text={texts[4]} link={links[4]} addSpace={true}></ProjectBlurb>

    // </div>

    useEffect(() => {
        setProjCountFunction(visibleComponentIndex);
        // projCount = visibleComponentIndex;
    }, [visibleComponentIndex]);

    return (
        <div className="highlighted-text w-1/3 animate-fade absolute 
        h-60 left-20 text-white overflow-y-auto no-scrollbar bottom-10
        max-md:w-3/4 max-md:bottom-20">
            {
                headers.map((header, index) => (
                    <ProjectBlurb
                        key={index}
                        header={header}
                        text={texts[index]}
                        link={links[index]}
                        addSpace={index != 0}
                        onVisible={setVisibleComponentIndex}
                        headersList={headers}
                    />
                ))}

            {/* Debugging */}
            {/* <p className="fixed top-5 left-5 bg-black text-white p-2">
                Currently Viewing: {visibleComponentIndex}
            </p>
            <p className="fixed top-20 left-5 bg-black text-white p-2">
                projCount : {projCount}
            </p> */}

        </div>

    );
    
}



export default Projects;