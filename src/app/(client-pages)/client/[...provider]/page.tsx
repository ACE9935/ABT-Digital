
import { getUserById } from "@/firebase/getUserById"
import { User, UserQRCode } from "@/types"
import { notFound, redirect } from "next/navigation"
import ClientPageSections from "./components/ClientPageSections"


export default async function ClientPage({ params }: { params: { provider: string[] } }) {  

    const [userId,qrCodeID]=params.provider
    const provider= await getUserById(userId)

    if(!provider) notFound()
    else {
  
     const qrCode=provider.qrCodes.find((obj:UserQRCode) => obj.id === qrCodeID)

     if(!qrCode) notFound()
     if(qrCode.type=="Basic"){
      redirect(qrCode.redirectoryLink!)
     }
     else {

      return (
       <div className="flex w-full min-h-screen xl:justify-none justify-center">
        <div className="self-center w-full max-w-[32rem]"><ClientPageSections qrCode={qrCode} clientId={provider.id}/></div>
        <div
        className="grow !bg-center !bg-cover xl:block hidden"
        style={{
          background:`url(/pattern.jpg)`,
          backgroundSize:"contain"
        }}
        ></div>
        </div>
      )
    }
    }
  }