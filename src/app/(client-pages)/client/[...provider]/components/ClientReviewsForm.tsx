"use client"
import BrandButton from "@/components/form/BrandButton";
import { useAppDispatch, useAppSelector } from "../client-state/hooks";
import { TransitionalClientComponent } from "./ClientPageSections";
import axios from "axios";
import { useRouter } from "next/navigation";


function ClientReviewsForm({handler}:TransitionalClientComponent) {

    const globalState = useAppSelector(state => state.client);
    const dispatch = useAppDispatch();
    const router = useRouter()

    const handleAccessTokenCreation = async (url:string): Promise<void> => {
      try {
          const response = await axios.post("/api/generate-client-access-token",{phoneNumber:globalState.client.infos.phoneNumber});
          const token = response.data.data; // Assuming the token is in the `data.token` field
          localStorage.setItem('clientAccessToken', token);
          console.log('Token created and stored:');
          router.push(url)
      } catch (error) {
          console.error('Error generating token:', error);
      }
    };

    return ( 
     <div className="p-9 rounded-lg w-full max-w-[34rem] flex flex-col items-center">
          
        <div className="flex flex-col gap-4">
        <img src={globalState.qrCode?.meta.logoImg} className="w-auto h-[6rem] self-center"/>
        <p className="text-lg text-center font-medium text-slate-600 relative pb-6">
         Merci de bien vouloir laisser un avis en suivant l'un des liens fournis ci-dessus.</p>
        </div>
      
      <div className="flex flex-col gap-4">
        {globalState.qrCode?.meta.reviewLinks.google&&<BrandButton onClick={()=>handleAccessTokenCreation(globalState.qrCode?.meta.reviewLinks.google!)} url="/google.png">Donner un avis Google</BrandButton>}
        {globalState.qrCode?.meta.reviewLinks.facebook&&<BrandButton onClick={()=>handleAccessTokenCreation(globalState.qrCode?.meta.reviewLinks.facebook!)} url="/facebook.png">Donner un avis Facebook</BrandButton>}
      </div>
      </div>
     );
}

export default ClientReviewsForm;