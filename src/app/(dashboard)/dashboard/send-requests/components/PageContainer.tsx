"use client"

import styled from '@emotion/styled'
import resolveConfig from 'tailwindcss/resolveConfig'
import Config from "../../../../../../tailwind.config";
import { useEffect, useState } from "react";
import EmailSection from "./EmailSection";
import { Select } from "@mui/material";
import SMSSection from './SMSSection';
import AutomatedNotificationsSection from './AutomatedNotificationsSection';
import SendRequestsSekeleton from './SendRequestsSkeleton';
import { useUser } from '@/context/authContext';
const tailwindConfig=resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as {[key:string]:string};
const primaryBlue = colors["primary-black"];

export const StyledSelect = styled(Select)`
   
   border-radius:8px !important;
   height:2.5rem;
   border:none;
   outline:1px solid lightgray;
   :hover{
    outline-width:2px
   }
   :focus{
    outline: 2px solid ${primaryBlue || "black"}; 
   }
  
`

function PageContainer() {

   const [section, setSection] = useState<"email" | "sms" | "notifications">("email")
   const {user}=useUser()

   const renderSection = () => {
    switch (section) {
      case 'sms':
        return <SMSSection/>; // Replace with your actual SMS content
      case 'email':
        return <EmailSection/>; // Replace with your actual Email content
      case 'notifications':
        return <AutomatedNotificationsSection/>;
      default:
        return null;
    }
  };

   return (
       <>{user?<div className="px-6 py-6 flex flex-col gap-10">
           <div>
               <h1 className="text-3xl font-bold pb-2">Système de Notification Automatisée</h1>
               <p className="text-slate-600 text-lg">
               Notre application envoie automatiquement des SMS et des emails personnalisés aux clients. Cela garantit des rappels de rendez-vous et des notifications importantes, améliorant la communication et la satisfaction client.
               </p>
           </div>
           <div>
               <div className="flex gap-2 justify-center pb-12">
               <button onClick={()=>setSection("notifications")} className={`px-6 ${section=="notifications"?"bg-primary-blue text-white":"bg-white text-slate-500"} hover:bg-primary-blue hover:text-white transition-all rounded-md font-bold p-2 shadow-md w-max md:max-w-[12rem] text-center`}>Mes notifications</button>
                   <button onClick={()=>setSection("sms")} className={`${section=="sms"?"bg-primary-blue text-white":"bg-white text-slate-500"} hover:bg-primary-blue hover:text-white transition-all rounded-md font-bold p-2 shadow-md max-w-[12rem] w-full text-center`}>SMS</button>
                   <button onClick={()=>setSection("email")} className={`${section=="email"?"bg-primary-blue text-white":"bg-white text-slate-500"} hover:bg-primary-blue hover:text-white transition-all rounded-md font-bold p-2 shadow-md max-w-[12rem] w-full text-center`}>Email</button>
               </div>
               <>{renderSection()}</>
           </div>
       </div>:
       <SendRequestsSekeleton/>
       }</>
   );
}

export default PageContainer;