// import { useState } from 'react';


interface Props {
    text: string
}

function Title(props: Props) {



    return <>
        <h1 className="font-bold absolute top-10 left-20 z-50 text-white text-2xl" id="info">{props.text}</h1>
    </>
} 


export default Title;