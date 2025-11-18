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
        header: "CleanSweep @ HackHarvard (Winner)",
        text: `
        - Route prediction with a Random Forest Classifier hosted on Databricks
                - Computer Vision to detect trash levels w/ OpenCV
                - Deployed infrastructure with Terraform and a Raspberry Pi server
        `,
        link: "https://devpost.com/software/cleansweep-tjq36w"
    },
    {
        header: "Technical Product Manager - Esports Prototype (Riot Games)",
        text: `
        - Prototyping an esports engagement platform for Riot Games as part of USC ProductSC
        - Leading the technical design and system architecture of the platform
                `,
        link: "https://lolesports.com/en-US/"
    },
    {
        header: "Simple Ray Caster engine",
        text: `
        - Really basic ray caster engine with C++ in the terminal
                `,
        link: "https://github.com/kakolla/simple-raycaster-engine"
    },
    {
        header: "Knapsack Problem Optimization with IBM Quantum (Winner) ",
        text: `
        - Applied the Knapsack problem to medical infrastructure allocation in the US 
        - Wrote the solution with IBM Qiskit on a 6-qubit quantum circuit`,
        link: "https://github.com/kakolla/quantum-knapsack-optimization"
    },
    {
        header: "Mystical Memories - ROBLOX Game Jam 2024 (Winner)",
        text: `
        - Developed a memory training minigame on Roblox
        - Wrote NPC AI physics w/ Coroutines and Tweening with a team`,
        link: "https://www.roblox.com/games/17043959296/Mystical-Memories-The-Genies-Challenge"
    },
    {
        header: "ML Research @ USC CNE",
        text: `
                - Developed gridding algorithms for large neuroanatomical datasets & modeled in-silico layers
                - Applied unsupervised learning techniques to reduce dendritic-tree generation time
                `,
        link: "https://github.com/NESCOM-Lab/2D-Hippocampus-Voxel-Coordinate-Visualization"
    },
    {
        header: "Graph Retrieval Augmented Generation Pipeline",
        text: `
        - Built a GraphRAG multi-agent pipeline @ USC CNE
                - Improved LLM reasoning across 120+ computational neuroscience documents with graph-based reasoning
        `,
        link: "https://github.com/NESCOM-Lab/knowledgegraphs"
    },
    
    {
        header: "C Compiler",
        text: `
        - WIP!
                - Started with ARM64 but now writing optimizations for x86-64 assembly
        `,
        link: "https://github.com/kakolla/c-compiler"
    },
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