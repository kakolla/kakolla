import { useState } from 'react';

import ThreeScene from './ThreeScene.tsx'
import Title from './Title.tsx'
import NavBar from './NavBar.tsx'


function App() {
    const [state, setState] = useState<string>("home");

    return <>
        <Title text='Abi Kakolla' pageState={state} />
        <ThreeScene />
        <NavBar pageState={state} onClickFunc={setState}/>

    </>




}

export default App;