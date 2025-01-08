// import { useState } from 'react';


interface Props {
    text: string
}

function Title(props: Props) {



    return <>
        <h1     className="absolute top-5 left-10 w-full z-50 text-white" id="info">{props.text}</h1>
    </>
} 


export default Title;