import './Loading.css';

interface Props {
    endLoadingScreen: boolean;

}



function Loading({ endLoadingScreen }: Props) {

    console.log("endloadingscreen is", endLoadingScreen);

    return <div>
        {
            (!endLoadingScreen) ? (
                <div className="bg-black h-screen">
                    <img className="top-1/2 left-1/2 absolute rotating-item" src="/planet.svg" width={40} ></img>
                </div>
            ) : (
                <></>
            )
        }



    </div>

}

export default Loading;