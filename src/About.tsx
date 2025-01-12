

interface Props {
    pageState: string;
}

function About({ pageState }: Props) {
    let text = `
    I’m an undergraduate student originally from Toronto, Canada. I'm very interested in using computers in the areas of neuroscience, software and game development, and engineering systems.
    I'm currently focused on exploring new methods of computing that make reverse engineering the brain possible. 
    `
    if (pageState === "about") {
        return <div className="absolute top-1/2 left-20 text-white overflow-y-auto no-scrollbar h-1/3 w-1/2">
            <h2>
                {text}
            </h2>
            <br />
            <h2><i>
                This site is still under construction, so please don't mind the incompleteness!
                </i>
            </h2>


        </div>


    }


}



export default About;