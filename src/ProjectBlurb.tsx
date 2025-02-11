import { useEffect, useRef } from "react";


interface Props {
    text: string,
    header: string,
    link: string
    addSpace: boolean,
    onVisible: (index: number) => void; // callback func to notify that its visible
    headersList: string[]
}


function ProjectBlurb(props: Props) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // props.onVisible(props.header); // notify parent (Projects.tsx) that its visible
                    props.onVisible(props.headersList.indexOf(props.header)); // notify parent (Projects.tsx) that its visible
                }
            },
            { threshold: 0.3 } // occurs when 50% of component is visible
        );
        
        if (ref.current) observer.observe(ref.current);

        // cleanup
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };

    }, [props.header]); // useEffect calls when header changes



    return <div ref={ref}>
        {props.addSpace && <>
            <br />
            <br />
            <br />
            <br />

        </>
        }
        <a className="w-100 text-2xl w-2/3 text-lime-600" href={props.link!} target="_blank">
            {props.header}
        </a>
        <h2 className="w-100 pt-2 max-w-xl">
            {props.text}
        </h2>
        <br />


    </div>


}
export default ProjectBlurb;