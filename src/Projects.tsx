import { useRef } from "react";


interface Props {
    projCount: number;
}

function Projects({ projCount }: Props) {

    let text: string | null = null;
    let header: string | null = null;
    let link: string | null = null;
    let containerRef = useRef<HTMLDivElement>(null);

    if (containerRef.current) {
        containerRef.current.scrollTop = 0;
    }

    if (projCount === 0) {
        header = "ML Researcher @ USC CNE"
        text = `
        I modeled in-silico layers of the Hippocampus used to generate a dendritic tree as part of a neural network using MeshLab and Python. 
        I also developed open-source software to grid datasets (containing 6 million neural points) that enhanced the overall neural mesh model resolution.
        I worked on implementing unsupervised learning techniques to reduce dendritic tree generation on a program called ROOTS.
                
        `
        link = "https://github.com/sayli247/2D-Hippocampus-Voxel-Coordinate-Visualization";
    }
    if (projCount === 1) {
        header = "CleanSweep @ HackHarvard (Winner)"
        text = `
        In a team of 4, we developed a smart city waste management platform that calculated optimized collection routes for sanitation trucks. I was
        responsible for writing the Computer Vision algorithm using OpenCV to detect real-time trash levels (of fake trash in a cup) and sending the data via a REST API to a Raspberry Pi server.
        I also implemented a Random Forest Classifier model in Databricks using Google Kubernetes Engine resources to make predictions using the
        real-time trash level data. We deployed the project with a React frontend and Terraform.

        `

        link = "https://devpost.com/software/cleansweep-tjq36w";
    }


    if (projCount === 2) {
        header = "HybridRAG pipeline for neuroscience-based text citation"
        text = `
        I'm currently developing a Hybrid Retrieval-Augmented Generation (RAG) pipeline for research faculty integrating Graph retrieval agents
        with Neo4j and LangChain, and vector-based agents with Pinecone, to enable neuroscience-focused text and citation generation. The panel 
        shown is a picture of the Graph database.

        `
        link = "https://github.com/NESCOM-Lab/knowledgegraphs";
    }
    if (projCount === 3) {
        header = "Mystical Memories - ROBLOX Game Jam winner 2024"
        text = `
        Developed a memory training minigame in a team of 4 using a memory palace concept.
        I programmed the character model physics using Coroutines for parallel processing and Tweening for smooth animations, enhancing gameplay fluidity. 
        I also designed and created the game models, environment, and post-processing effects.

        `
        link = "https://www.roblox.com/games/17043959296/Mystical-Memories-The-Genies-Challenge"
    }
    if (projCount === 4) {
        header = "Scribo – AI Email classifier app"
        text = `
        I found myself dreading to read my email every week, so I created a light-weight program to automatically classify my inbox to make email reading 
        faster and easier. I implemented a Gaussian Naive Bayes classifier from scratch (no Scikit-learn) by programming the matrix multiplication algorithms,
        performing feature engineering using self-selected parameters, and training it using 2 months’ worth of my own supervised email data.
        This program stars (⭐) the most important emails and generates a to-do list using Gemini AI for users to paste into their to-do app of choice. 
        `

        link = "https://github.com/kakolla/Scribo"
    }

    return <div ref={containerRef} className="highlighted-text animate-fade absolute top-2/3 left-20 text-white overflow-y-auto no-scrollbar bottom-20">
        <h1 className="text-2xl w-2/3">
            {header}
        </h1>
        <h2 className="w-100 pt-2 max-w-xl">
            {text}
        </h2>
        <br />
        <a className="w-100 pt-2 max-w-xl" href={link!} target="_blank">
            Link
        </a>


    </div>

}



export default Projects;