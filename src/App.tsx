import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ThreeScene from './ThreeScene.tsx'
import Title from './Title.tsx'
import NavBar from './NavBar.tsx'
import Home from './Home.tsx'
import About from './About.tsx'
import Contacts from './Contacts.tsx'
import { Analytics } from '@vercel/analytics/react'
import Loading from './Loading.tsx'
import Notes from './Notes.tsx'
import PostPage from './PostPage.tsx'

function MainPages({ pageState }: { pageState: string }) {
    return (
        // Main navigable pages
        <div>
            <Home pageState={pageState} />
            <Notes pageState={pageState} />
            <About pageState={pageState} />
            <Contacts />
        </div>
    )
}

function App() {
    const [state, setState] = useState("home")
    const [endLoadingScreen, setEndLoadingScreen] = useState(false)

    return (
        <Router>
            <Analytics />
            <Loading endLoadingScreen={endLoadingScreen} />
            {/* Main components */}
            <Title text="Abi Kakolla" />
            <ThreeScene pageState={state} setPage={setState} setEndLoadingScreen={setEndLoadingScreen} />
            <NavBar pageState={state} onClickFunc={setState} />

            {/* Route to posts on the note page */}
            <Routes>
                <Route path="/" element={<MainPages pageState={state} />} />
                <Route path="/:slug" element={<PostPage />} />
            </Routes>
        </Router>
    )
}

export default App
