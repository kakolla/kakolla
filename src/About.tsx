

interface Props
{
    pageState: string;
}

function About({ pageState} : Props) {
    if (pageState === "about")
    {
        return <div className="absolute top-1/2 left-20 text-white overflow-y-auto no-scrollbar h-1/3">
            <h2>
                coming soon..
            </h2>


        </div>


    }


}



export default About;