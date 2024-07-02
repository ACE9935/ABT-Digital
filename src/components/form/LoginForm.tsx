"use client"
import BasicInput from "./BasicInput";
import BasicButton from "./BasicButton";
import BrandButton from "./BrandButton";
import Link from "next/link";
import { FormEvent, useEffect,useState } from "react";
import { doSignInWithEmailAndPassword } from "@/firebase/auth";
import { Alert } from "@mui/material";
import { LoginResponse } from "@/types";
import { useRouter } from "next/navigation";
import ResetPwd from "./ResetPwd";
import { useToast } from "@chakra-ui/react";
import AppToast from "../AppToast";
import { CheckCircle } from "@mui/icons-material";
import AppSpinner from "../AppSpinner";

function LoginForm({resetPassword}:{resetPassword:string | null}) {
    const [initialUser, setInitialUser] = useState({email:"",pwd:""})
    const [response, setResponse] = useState<LoginResponse>({errorMsg:null,status:null})
    const [isRegistering, setIsRegistering] = useState(false)
    const toast=useToast()
    const router = useRouter()

    const onSubmit = async (e:FormEvent) => {
        e.preventDefault()
        
        if(!isRegistering) {
            setIsRegistering(true)
            const serverResponse=await doSignInWithEmailAndPassword(initialUser.email,initialUser.pwd)
            
            setIsRegistering(false)
            setResponse(serverResponse)
        }
    }
    
    useEffect(()=>{
        if(resetPassword=="true") toast({
            position:'bottom-left',
            render:()=>(<AppToast variant='SUCCESS' title='Votre mot de passe a été réinitialisé' Icon={CheckCircle}/>),
            duration: 3000,
          })
      },[])

    useEffect(()=>{
      if(response.status=="OK") router.push("/")
    
    },[response])

    return ( 
        <div className="bg-secondary-color p-9 rounded-lg w-full max-w-[28rem]">
            {isRegistering&&<AppSpinner size={50} variant="LIGHT" className="fixed top-0 right-0 m-4"/>}
            <h1 className="text-primary-color text-4xl font-bold pb-11 text-center">Se connecter</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {response.status=="ERROR"&&<Alert severity="error">{response.errorMsg}</Alert>}
                <BasicInput
                value={initialUser.email} 
                onChange={(e) => setInitialUser(prev => ({ ...prev, email: e.target.value }))} 
                label="E-mail"/>
                <BasicInput
                value={initialUser.pwd} 
                onChange={(e) => setInitialUser(prev => ({ ...prev, pwd: e.target.value }))} 
                label="Mot de passe" type="password"/>
                <ResetPwd/>
                <BasicButton>Se connecter</BasicButton>
            </form>
            <div className="flex flex-col pt-4">
            <BrandButton url="/google.png">Se connecter avec Google</BrandButton>
                <span className="text-center font-bold mt-2">Vous n'avez pas déjà un compte? <Link href='/signup' className="underline text-primary-blue">S'inscrire</Link></span>
                </div>
        </div>
    );
}

export default LoginForm;