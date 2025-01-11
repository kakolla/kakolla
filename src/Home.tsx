import React from "react";


interface Props {
    pageState: string;
}
function Home({ pageState }: Props) {
    if (pageState === "home") {
        return <div className="absolute top-1/2 left-20  text-white overflow-y-auto no-scrollbar h-1/3">
            <h1 className="text-2xl">Hi there, I'm Abi</h1>
            <h1 className="pt-4">I'm currently a 2nd year CS Student at USC.</h1>
            <p className="pt-2 max-w-xl">
                My love for computers and everything engineering started when I was 8 when I learned how to use windows shell scripting
                to create my first quiz game. Ever since then, I've loved using computers to build creative solutions for all sorts of problems.
            </p>

            <br />
            <br />
            <p className="pt-2 max-w-xl">
                Currently, I'm super passionate about the intersection of neuroscience, machine learning, and computer science. I've spent
                the last few years performing research at the Center for Neural Engineering @ USC, working on startups, participating in Hackathons, and much more!
            </p>

            <br />
            <br />
            <p className="pt-2 max-w-xl">When I'm not learning, I love to do calisthenics, listen to rnb music, and play horror games.
                If you're also on this lifelong journey of learning and resonate with anything, please connect with me!
            </p>





        </div>
    }




}


export default React.memo(Home);