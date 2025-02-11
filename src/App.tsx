import { useState } from 'react';

import ThreeScene from './ThreeScene.tsx'
import Title from './Title.tsx'
import NavBar from './NavBar.tsx'
import Home from './Home.tsx';
import About from './About.tsx';
import Contacts from './Contacts.tsx';
import { Analytics } from "@vercel/analytics/react"


function App() {
    const [state, setState] = useState<string>("home");

    return <>
        <Analytics /> 
        <Title text="Abi Kakolla" pageState={state} />
        <Home pageState={state} />
        <About pageState={state} />
        <ThreeScene pageState={state} setPage={setState}/>
        <NavBar pageState={state} onClickFunc={setState}/>
        <Contacts />
    </>




}

export default App;