

interface Props
{
    projCount: number;
}

function Projects({ projCount} : Props) {

    let text: string | null = null;
    let header: string | null = null;
    if (projCount === 0)
    {
        header = "ML Researcher @ USC CNE"
        text = "3D Reconstruction of the Rat Hippocampus"


    }
    if (projCount === 1)
        {
            header = "CleanSweep @ HackHarvard (Winner)"
            text = "Project..."
    
    
        }

        return <div className="absolute top-2/3 left-20 text-white overflow-y-auto no-scrollbar h-50">
            <h1 className="text-2xl">
                {header}
            </h1>
            <h2 className="w-100 pt-2 max-w-xl">
                {text}
            </h2>


        </div>

}



export default Projects;