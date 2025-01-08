// import { useState } from 'react';


interface Props {
    text: string
}

function Title(props: Props) {



    return <>
        <h1 className="text-4xl font-bold underline" id="info">{props.text}</h1>
    </>
} 


export default Title;