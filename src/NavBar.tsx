// import React from 'react';


interface Props
{
    pageState: string,
    onClickFunc: any;
}

function NavBar(props: Props) {


    return <div className="absolute top-1/2 right-10 w-40 ">
    <button className="mr-0 ml-auto text-white block font-bold" onClick={() => props.onClickFunc("home")}>home</button>
    <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => props.onClickFunc("stuff")}>projects</button>
    <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => props.onClickFunc("about")}>about me</button>
    </div>;
}

export default NavBar;