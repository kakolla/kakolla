import { useEffect, useRef, useState } from "react";
import ProjectBlurb from "./ProjectBlurb";

// project data
interface Project {
    header: string;
    text: string;
    link: string;
}

interface Props {
    projCount: number;
    setProjCountFunction: (index: number) => void;
}

// project data
const PROJECTS: Project[] = [
    {
        header: "ML Researcher @ USC CNE",
        text: `Modeled in-silico layers of the Hippocampus used to generate a dendritic tree as part of a neural network.
        Also developed algorithms to grid large datasets and implemented unsupervised learning techniques to reduce tree generation time.`,
        link: "https://github.com/NESCOM-Lab/2D-Hippocampus-Voxel-Coordinate-Visualization"
    },
    {
        header: "CleanSweep @ HackHarvard (Winner)",
        text: `In a team, developed a smart city waste management platform that calculated optimized collection routes for sanitation trucks.
        Used Computer Vision techniques to detect real-time trash levels that were sent to a Raspberry Pi server.
        Implemented a Random Forest Classifier model in Databricks to make predictions, deployed on Terraform.`,
        link: "https://devpost.com/software/cleansweep-tjq36w"
    },
    {
        header: "Graph Retrieval Augmented Generation Pipeline",
        text: `Built a GraphRAG multi-agent chain-of-thought pipeline leveraging knowledge graphs to
        improve LLM reasoning across 100+ computational neuroscience documents. Used LangChain,
        Neo4j, & NetworkX`,
        link: "https://github.com/NESCOM-Lab/knowledgegraphs"
    },
    {
        header: "Mystical Memories - ROBLOX Game Jam winner 2024",
        text: `Developed a memory training minigame in a team using a memory palace concept.
        Programmed the game AI physics using Coroutines and Tweening for smooth animations.
        Designed and created the game models, environment, and post-processing effects.`,
        link: "https://www.roblox.com/games/17043959296/Mystical-Memories-The-Genies-Challenge"
    },
    {
        header: "2D Hippocampus Voxel Visualization @ CNE",
        text: `Visualized in-silico slices of the Hippocampus. Wrote gridding & artefact removal algorithms using
        Python and NumPy, used by faculty. UI built with Streamlit and Matplotlib`,
        link: "https://github.com/NESCOM-Lab/2D-Hippocampus-Voxel-Coordinate-Visualization"
    },
    {
        header: "Retinal Cells splitting @ CNE",
        text: `Split multi-soma .SWC files into separate files for each soma, and converted
        them to model-compatible formats using Python.`,
        link: "https://github.com/NESCOM-Lab/retinal-cells-model"
    },
    {
        header: "Scribo",
        text: `Developed a light-weight email viewing client that classifies emails as important using a Gaussian Naive Bayes Classifier.
        Feature-engineered using self-selected parameters and trained using 2 months worth of supervised email data.`,
        link: "https://github.com/kakolla/Scribo"
    }
];

function Projects({ projCount, setProjCountFunction }: Props) {
    const [visibleComponentIndex, setVisibleComponentIndex] = useState<number>(projCount);
    const containerRef = useRef<HTMLDivElement>(null);

    // update parent component when visible project changes
    useEffect(() => {
        setProjCountFunction(visibleComponentIndex);
    }, [visibleComponentIndex, setProjCountFunction]);

    return (
        <div
            ref={containerRef}
            className="highlighted-text w-1/3 animate-fade absolute
            h-[35vh] left-20 text-white overflow-y-scroll no-scrollbar bottom-10
            max-md:w-3/4 max-md:h-48
            snap-y snap-mandatory scroll-smooth"
        >
            {PROJECTS.map((project, index) => (
                <ProjectBlurb
                    key={index}
                    header={project.header}
                    text={project.text}
                    link={project.link}
                    addSpace={index !== 0}
                    onVisible={setVisibleComponentIndex}
                    headersList={PROJECTS.map(p => p.header)}
                />
            ))}
        </div>
    );
}



export default Projects;