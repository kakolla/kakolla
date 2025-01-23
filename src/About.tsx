

interface Props {
    pageState: string;
}

function About({ pageState }: Props) {
    // let text = `
    // My name's Abi Kakolla. 
    
    
    // `
    if (pageState === "about") {
        return <div className="animate-fade absolute top-2/3 left-20 text-white overflow-y-auto no-scrollbar bottom-10 w-1/2">
            <p className="pt-2 max-w-xl">
                My love for computers and everything engineering started when I was 8 when I learned how to use windows shell scripting
                to create my first quiz game. Ever since then, I've loved using computers to build creative solutions for all sorts of problems.
            </p>

            <br />
            <p className="pt-2 max-w-xl">
                Currently, I'm super passionate about the intersection of neuroscience, machine learning, and computer science. I've spent
                the last few years performing research at the Center for Neural Engineering @ USC, working on startups, participating in Hackathons, and much more!
            </p>

            <br />
            <p className="pt-2 max-w-xl">When I'm not learning, I love to do calisthenics, listen to rnb music, and play horror games.
                If you're also on this lifelong journey of learning or resonate with anything, please connect with me!
            </p>
            <br />
            <h2><i>
                This site is still under construction, so please don't mind the incompleteness!
                </i>
            </h2>


        </div>


    }


}



export default About;