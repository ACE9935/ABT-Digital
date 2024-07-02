"use client"
import ClientInput from "@/app/(client-pages)/client/[...provider]/components/ClientInput";
import { useAppDispatch, useAppSelector } from "../../qr-code-state/hooks";
import { configurations } from "@/app-configurations";
import { FormEvent, useState } from "react";
import { setQRCodeMetaReviewLinks } from "../../qr-code-state/qr-code-state";
import { Alert } from "@mui/material";
import { TransitionalComponent } from "./QrcodeEditor";

function QrcodeEditorThirdSection({handlerForward,handlerPrevious}:TransitionalComponent) {

    const dispatch=useAppDispatch()
    const qrCodeState = useAppSelector(state => state.qrCode);
    const [errors,setErrors]=useState(false)

    const handleSubmit=(e:FormEvent)=>{
      e.preventDefault()
      if(!qrCodeState.meta.reviewLinks.google && !qrCodeState.meta.reviewLinks.facebook) setErrors(true)
      else handlerForward()
    }

    return ( <div className="w-full max-w-[32rem]">
        <div className="pb-4 ">
            <h2 className="text-2xl font-bold pb-1">Modifier votre lien d'avis</h2>

            <p className="text-slate-600">C'est le lien que vos clients visiteront pour vous laisser un avis. Personnalisez la page en modifiant les textes et les images.</p>
            </div>
        <form onSubmit={handleSubmit} className="bg-secondary-color p-9 rounded-lg w-full max-w-[30rem] flex flex-col items-center gap-4">

        <img src={
          typeof qrCodeState.meta.logoImg == "string"?
          qrCodeState.meta.logoImg
          :qrCodeState.meta.logoImg?URL.createObjectURL(qrCodeState.meta.logoImg):configurations.userImg
          } className="w-auto h-[6rem]" />
        {errors?<Alert severity="error">Veuillez fournir un lien pour recevoir les avis</Alert>:<></>}
            <div className="flex flex-col gap-2 w-full max-w-[22rem]">
                <label htmlFor="google-url-input" className="font-bold">Lien d'avis Google</label>
            <ClientInput
            error={errors}
            value={qrCodeState.meta.reviewLinks.google}
            onChange={(e)=>{
                if(errors) setErrors(false)
                dispatch(setQRCodeMetaReviewLinks({...qrCodeState.meta.reviewLinks,google:e.target.value}))
            }}
            id="google-url-input"
            label="Lien Google"
            />
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[22rem]">
            <label htmlFor="facebook-url-input" className="font-bold">Lien d'avis Facebook</label>
            <ClientInput
            error={errors}
            value={qrCodeState.meta.reviewLinks.facebook}
            onChange={(e)=>{
                if(errors) setErrors(false)
                dispatch(setQRCodeMetaReviewLinks({...qrCodeState.meta.reviewLinks,facebook:e.target.value}))
            }}
            id="facebook-url-input"
            label="Lien Facebook"
            />
            </div>
            <div className="flex gap-2 self-center">
        <button onClick={(e)=>{
          e.preventDefault()
          if(handlerPrevious) handlerPrevious()
        }} className="outline-primary-color p-3 font-bold rounded-full text-primary-color self-center px-6 flex gap-2 outline">
        Précédant
        </button>
        <button type="submit" className="bg-primary-color p-3 font-bold rounded-full text-white self-center px-6 flex gap-2">
          Continuer
        </button>
        </div>
        </form>
    </div> );
}

export default QrcodeEditorThirdSection;