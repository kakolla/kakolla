// import React from 'react';


function NavBar() {


    return (<div className="absolute top-1/2 right-10 w-40 ">
    <button className="mr-0 ml-auto text-white block font-bold" onClick={() => {alert("home")}}>home</button>
    <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => {alert("about")}}>about me</button>
    <button className="mr-0 ml-auto text-white block pt-2 font-bold" onClick={() => {alert("projs")}}>stuff i've made</button>
    </div>);
}

export default NavBar;