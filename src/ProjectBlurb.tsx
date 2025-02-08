

interface Props {
    text: string,
    header: string,
    link: string
    addSpace: boolean
}


function ProjectBlurb(props: Props) {




    return <>
        {props.addSpace && <>
            <br />
            <br />
            <br />
            <br />

        </>
        }
        <h1 className="w-100 text-2xl w-2/3">
            {props.header}
        </h1>
        <h2 className="w-100 pt-2 max-w-xl">
            {props.text}
        </h2>
        <br />
        <a className="w-100 pt-2 max-w-xl" href={props.link!} target="_blank">
            Link
        </a>


    </>


}
export default ProjectBlurb;