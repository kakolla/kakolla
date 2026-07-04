

interface Props {
    pageState: string;
}

function About({ pageState }: Props) {
    // let text = `
    // My name's Abi Kakolla. 


    // `
    if (pageState === "about") {
        return <div className="highlighted-text animate-fade absolute top-2/3 left-20  
        text-white overflow-y-auto no-scrollbar bottom-10
        max-md:w-3/4 max-md:bottom-10">
            <p className="pt-2 max-w-xl">
                ─── ･ about me ･ ───
            </p>
            <p className="pt-2 max-w-xl">
                My interest for computing and engineering started when I was 8 when I learned how to use VBScript
                to create my first gui-based quiz game on my mom's windows Vista. I've loved taking apart laptops, modifying firmware,
                messing with operating systems, and creating things at the intersection of hardware and software.

            </p>

            <br />
            <p className="pt-2 max-w-xl">
                Currently, I'm excited about the intersection of neuroscience, machine learning, and computer science. I've spent
                the last few years performing research at the Center for Neural Engineering @ USC, working for startups, participating in hackathons, and
                trying to get as low level as I can with computer science.
            </p>

            <br />
            <p className="pt-2 max-w-xl">When I'm not learning, I love to do calisthenics, listen to rnb music, and spend way too much time editing my dotfiles.
                If you're also on this lifelong journey of learning or resonate with anything, please connect with me!
            </p>
            <br />
            <h2 className="pt-2 max-w-xl"><i>
                P.S. the model of Toronto and the rest of the website were created by me in Blender and with TS (not AI).
            </i>
            </h2>


        </div>


    }


}



export default About;
