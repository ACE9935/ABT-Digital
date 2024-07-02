import { useDisclosure, useToast } from "@chakra-ui/react";
import { CheckCircle, CloseOutlined } from "@mui/icons-material";
import { Modal,Box,IconButton } from "@mui/material";
import { ModalStyles } from "./SignupForm";
import BasicInput from "./BasicInput";
import BasicButton from "./BasicButton";
import { PwdResetResponse } from "@/types";
import { FormEvent, useEffect, useState } from "react";
import { resetPassword } from "@/firebase/auth";
import AppToast from "../AppToast";
import AppSpinner from "../AppSpinner";

function ResetPwd() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [response, setResponse] = useState<PwdResetResponse>({errorMsg:null,status:null})
    const [email, setEmail] = useState("")
    const toast = useToast()
    const [isRegistering, setIsRegistering] = useState(false)
    
    const onSubmit = async (e:FormEvent) => {
        e.preventDefault()
        e.stopPropagation();
        if(!isRegistering) {
            setIsRegistering(true)
            const serverResponse=await resetPassword(email)
                  .finally(()=>setIsRegistering(false))
            setIsRegistering(false)
            setResponse(serverResponse)
        }
    }

    useEffect(()=>{
     if(response.status=="OK"){
        onClose()
        toast({
            position:'bottom-left',
            render:()=>(<AppToast variant='SUCCESS' title='Un lien de réinitialisation de mot de passe a été envoyé à votre email' Icon={CheckCircle}/>),
            duration: 3000,
          })
     }
    },[response])
    return ( 
        <>
        <Modal open={isOpen} onClose={onClose} disableAutoFocus>
            
        <Box sx={ModalStyles} className='p-6 sm:px-14 flex flex-col items-center gap-8 pb-14 rounded-md'>
        {isRegistering&&<AppSpinner size={50} variant="DARK" className="absolute left-0 top-0 m-6"/>}
    <div className='flex self-end relative'>
        <IconButton onClick={onClose}>
            <CloseOutlined sx={{fontSize:30}}/>
        </IconButton>
    </div>
    <h1 className='text-center text-2xl'>Réinitialisation du mot de passe</h1>
    <p className='text-center'>
        Entrez votre adresse e-mail ci-dessous pour recevoir le lien de réinitialisation de votre mot de passe.
    </p>
    <form onSubmit={onSubmit} className="flex flex-col gap-4 items-center">
        <BasicInput error={response.status=="ERROR"} helperText={response.errorMsg} value={email} onChange={(e)=>setEmail(e.target.value)} label="Entrez votre adresse e-mail"/>
        <BasicButton type='submit'>Envoyer le lien de réinitialisation</BasicButton>
    </form>
</Box>
      </Modal>
      <span onClick={onOpen} className="text-sm underline text-black cursor-pointer">Mot de passé oublié ?</span>
      </>
     );
}

export default ResetPwd;