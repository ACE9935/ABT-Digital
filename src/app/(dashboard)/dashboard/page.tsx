"use client"

import AppToast from "@/components/AppToast";
import { useToast } from "@chakra-ui/react";
import { Check } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {

  const searchParams = useSearchParams()
  const toast = useToast()

  useEffect(()=>{

   if(searchParams.get("verifiedUser")) toast({
    position: 'bottom-left',
    render: () => (
      <AppToast variant="SUCCESS" title="Email vérifié avec succès" Icon={Check}/>
    ),
  })

  },[])

  return (
    <div className="p-6 flex gap-4 bg-blue-200 min-h-full">
       
    </div>
  );
}