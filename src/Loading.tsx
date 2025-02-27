

interface Props {
    endLoadingScreen: boolean;

}



function Loading({endLoadingScreen} : Props) {

    console.log("endloadingscreen is", endLoadingScreen);

    return <div className="top-1/2 left-1/2 absolute">
            {
                (!endLoadingScreen) ? (
                    <img src="/planet.svg" width={40} ></img>
                ) : (
                    <></>
                )
            }



    </div>
    
}

export default Loading;