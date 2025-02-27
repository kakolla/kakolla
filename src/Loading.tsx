

interface Props {
    endLoadingScreen: boolean;

}



function Loading({endLoadingScreen} : Props) {

    console.log("endloadingscreen is", endLoadingScreen);

    return <div className="highlighted-text top-1/2 left-1/2 animate-fade absolute text-white ">
            {
                (!endLoadingScreen) ? (
                    <h1>Loading</h1>
                ) : (
                    <h1>done</h1>
                )
            }



    </div>
    
}

export default Loading;