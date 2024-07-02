"use client"
import { Provider } from "react-redux";
import { store } from "../../qr-code-state/store";
import QrcodeDisplay from "./QrcodeDisplay";
import QrcodeEditor from "./QrcodeEditor";


function QrcodeTab() {
    return ( 
        <Provider store={store}>
        <div className="md:flex-row flex flex-col gap-8 w-full max-w-[1000px]">
        <div className="py-12"><QrcodeDisplay/></div>
        <QrcodeEditor/>
        </div>
        </Provider>
     );
}

export default QrcodeTab;