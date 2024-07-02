"use client"
import ClientFormInstance from "./ClientFormInstance";
import { TransitionalComponent } from "./QrcodeEditor";

function QrcodeEditorSecondSection({handlerForward,handlerPrevious}:TransitionalComponent) {

    return ( 
        <div className="w-full max-w-[32rem] py-4">
            <div className="pb-4">
            <h2 className="text-2xl font-bold pb-1">Modifier votre lien d'avis</h2>

            <p className="text-slate-600">C'est le lien que vos clients visiteront pour vous laisser un avis. Personnalisez la page en modifiant les textes et les images.</p>
            </div>
            <ClientFormInstance handlerForward={handlerForward} handlerPrevious={handlerPrevious}/>
        </div>
     );
}

export default QrcodeEditorSecondSection;