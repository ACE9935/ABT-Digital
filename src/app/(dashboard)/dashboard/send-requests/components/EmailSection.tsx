"use client"
import { AutomateType, User } from "@/types";
import { Checkbox, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { StyledSelect } from "./PageContainer";
import EmailCustomizerForm from "./EmailCustomizerForm";
import { useUser } from "@/context/authContext";


function EmailSection() {

   const [automate, setAutomate] = useState(false);
   const { user, updateUser,loading } = useUser();
   const [automateType, setAutomateType] = useState("Email")
   const [automateValue, setAutomateValue] = useState<AutomateType>("3-day");

    return ( 
        <div>
                   <h2 className="font-bold text-lg pb-3">Demande d'Avis par Email</h2>
                   <div className="bg-white shadow-md rounded-md py-8 px-6">
                       <h3 className="font-semibold pb-6">Invitez Vos Clients</h3>
                       <button className="rounded-md font-bold text-white bg-black p-3">Voir vos clients enregistrés</button>
                       <div className="mt-3 flex items-center">
                           <Checkbox disableRipple className="!px-0" id="automate-checkbox" checked={automate} onChange={() => setAutomate(prev => !prev)} color="default" />
                           <label htmlFor="automate-checkbox" className="font-bold text-md pl-2">Activer l'automatisation</label>
                       </div>
                       {automate&&<div className="p-3 border-l-2 mt-1"><StyledSelect
                           value={automateValue}
                           onChange={(e) => setAutomateValue(e.target.value as AutomateType)}
                       >
                           <MenuItem value={"3-day"}>Chaque 3 jours</MenuItem>
                           <MenuItem value={"1-week"}>Chaque semaine</MenuItem>
                           <MenuItem value={"1-month"}>Chaque mois</MenuItem>
                           <MenuItem value={"3-month"}>Chaque 3 mois</MenuItem>
                       </StyledSelect></div>}
                       <EmailCustomizerForm automateType={automateType} automate={automate} automateValue={automateValue}/>
                   </div>
               </div>
     );
}

export default EmailSection;