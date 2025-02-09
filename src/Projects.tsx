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

    const [visibleComponentIndex, setVisibleComponentIndex] = useState<number>(0); // index of current visible component

    let containerRef = useRef<HTMLDivElement>(null);

    if (containerRef.current) {
        containerRef.current.scrollTop = 0;
    }


    headers.push("ML Researcher @ USC CNE");
    texts.push(`
        I modeled in-silico layers of the Hippocampus used to generate a dendritic tree as part of a neural network using MeshLab and Python. 
        I also developed open-source software to grid datasets (containing 6 million neural points) that enhanced the overall neural mesh model resolution.
        I worked on implementing unsupervised learning techniques to reduce dendritic tree generation on a program called ROOTS.
                
        `);
    links.push("https://github.com/sayli247/2D-Hippocampus-Voxel-Coordinate-Visualization");

    headers.push("CleanSweep @ HackHarvard (Winner)");
    texts.push(`
        In a team of 4, we developed a smart city waste management platform that calculated optimized collection routes for sanitation trucks. I was
        responsible for writing the Computer Vision algorithm using OpenCV to detect real-time trash levels (of fake trash in a cup) and sending the data via a REST API to a Raspberry Pi server.
        I also implemented a Random Forest Classifier model in Databricks using Google Kubernetes Engine resources to make predictions using the
        real-time trash level data. We deployed the project with a React frontend and Terraform.
                
        `);
    links.push("https://devpost.com/software/cleansweep-tjq36w");

    headers.push("HybridRAG pipeline for neuroscience-based text citation");
    texts.push(`
        I'm currently developing a Hybrid Retrieval-Augmented Generation (RAG) pipeline for research faculty integrating Graph retrieval agents
        with Neo4j and LangChain, and vector-based agents with Pinecone, to enable neuroscience-focused text and citation generation. The panel 
        shown is a picture of the Graph database.
                
        `);
    links.push("https://github.com/NESCOM-Lab/knowledgegraphs");


    headers.push("Mystical Memories - ROBLOX Game Jam winner 2024");
    texts.push(`
        Developed a memory training minigame in a team of 4 using a memory palace concept.
        I programmed the character model physics using Coroutines for parallel processing and Tweening for smooth animations, enhancing gameplay fluidity. 
        I also designed and created the game models, environment, and post-processing effects.
                
        `);
    links.push("https://www.roblox.com/games/17043959296/Mystical-Memories-The-Genies-Challenge");

    headers.push("Scribo – AI Email classifier app");
    texts.push(`
        I found myself dreading to read my email every week, so I created a light-weight program to automatically classify my inbox to make email reading 
        faster and easier. I implemented a Gaussian Naive Bayes classifier from scratch (no Scikit-learn) by programming the matrix multiplication algorithms,
        performing feature engineering using self-selected parameters, and training it using 2 months’ worth of my own supervised email data.
        This program stars (⭐) the most important emails and generates a to-do list using Gemini AI for users to paste into their to-do app of choice. 
                
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
        <div className="highlighted-text w-1/3 animate-fade absolute h-80 left-20 text-white overflow-y-auto no-scrollbar bottom-10">
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