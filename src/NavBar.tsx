import { useNavigate } from 'react-router-dom'

interface Props {
    pageState: string
    onClickFunc: (newState: string) => void
}

function NavBar(props: Props) {
    const navigate = useNavigate() // hook to navigate without reloading

    const handleClick = (section: string) => {
        navigate('/')              // route back to homepage
        props.onClickFunc(section) // set the section (e.g., notes, about)
    }

    return (
        // Navbar buttons - on mobile display place at top
        <div className="z-50 absolute top-20 right-10 w-40 md:top-1/2">
            <button className="mr-0 ml-auto text-white block font-bold" onClick={() => handleClick("home")}>home</button>
            <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => handleClick("stuff")}>projects</button>
            <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => handleClick("notes")}>notes</button>
            <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => handleClick("about")}>about me</button>
        </div>
    )
}

export default NavBar;