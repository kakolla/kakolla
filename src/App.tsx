import { useState } from 'react';

import ThreeScene from './ThreeScene.tsx'
import Title from './Title.tsx'
import NavBar from './NavBar.tsx'
import Home from './Home.tsx';
import About from './About.tsx';
import Contacts from './Contacts.tsx';
import { Analytics } from "@vercel/analytics/react"
import Loading from './Loading.tsx';
import Notes from './Notes.tsx';


function App() {
    const [state, setState] = useState<string>("home");
    const [endLoadingScreen, setEndLoadingScreen] = useState<boolean>(false);

    return <>
        <Analytics /> 
        <Loading endLoadingScreen={endLoadingScreen}/>
        <Title text="Abi Kakolla" pageState={state} />
        <Home pageState={state} />
        <Notes pageState={state} />
        <About pageState={state} />
        <ThreeScene pageState={state} setPage={setState} setEndLoadingScreen={setEndLoadingScreen}/>
        <NavBar pageState={state} onClickFunc={setState}/>
        <Contacts />
    </>




}

export default App;