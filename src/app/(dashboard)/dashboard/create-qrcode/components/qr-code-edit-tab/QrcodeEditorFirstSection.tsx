"use client"
import React, { useRef, useState } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../qr-code-state/hooks";
import { resetQRCodeSate, setCorrectionLevel, setDarkColor, setLightColor, setMargin, setQRCodeName, setQRCodeRedicectoryLink, setQRCodeText, setQRCodeType } from "../../qr-code-state/qr-code-state";
import { Alert, MenuItem, Select } from "@mui/material";
import BasicButton from "@/components/form/BasicButton";
import { auth } from "@/firebase/firebase";
import AppSpinner from "@/components/AppSpinner";
import { useRouter } from "next/navigation";
import { configurations } from "@/app-configurations";
import { useUser } from "@/context/authContext";

var QRCode = require('qrcode')

interface ColorPickerProps {
  title: string;
  action: ActionCreatorWithPayload<any>;
  color: string;
  index?:number
}

export const ColorPicker = ({ title, action, color,index }: ColorPickerProps) => {
  const dispatch = useAppDispatch();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if(index) dispatch(action([index-1,newColor]));
    else dispatch(action(newColor));
  };

  return (
    <div>
      <label htmlFor={title} className="flex gap-4 items-center cursor-pointer">
        <h3 className="font-bold">{title}</h3>
        <div className="flex items-center gap-3 p-2 border-2 focus-within:border-primary-blue">
          <div className="border-r-2 pr-2">{color}</div>
          <input 
            onChange={handleColorChange}
            className="!w-[30px] !h-[30px] !border-none !outline-none !cursor-pointer" 
            type="color" 
            id={title}
            value={color}
          />
        </div>
      </label>
    </div>
  );
};

function QrcodeEditorFirstSection({handler, isLoading}:{handler:()=>void,isLoading:boolean}) {

  const qrCodeState = useAppSelector(state => state.qrCode);
  const dispatch = useAppDispatch();
  const {user}=useUser()
  const linkInputRef=useRef<HTMLInputElement|null>(null)
  const [error,setErrorMsg]=useState<{msg:string,type:string|null}>({msg:"",type:null})
  const router=useRouter()

  const handleSectionTransition = ()=>{
    
    if(qrCodeState.name=="") setErrorMsg({msg:"Une erreur est survenue",type:"name"})
    else{
     setErrorMsg({msg:"",type:""})
     handler()
    }
  }


  return ( 
    <div className="flex flex-col gap-4">
      {error.msg?<Alert severity="error">{error.msg}</Alert>:<></>}
      <div className="flex flex-col gap-4 bg-white shadow-lg p-4 rounded-md">
      <h2 className="text-4xl">Contenu</h2>
      <div className="relative flex">
      <input
          disabled={qrCodeState.type=="Premium"}
          ref={linkInputRef}
          className="p-1 w-full outline-none disabled:bg-slate-200 bg-transparent border-2 border-gray-300 focus:border-primary-blue"
          id='QRCode-text-input'
          value={qrCodeState.type=="Premium"?qrCodeState.text:qrCodeState.redirectoryLink} 
          onChange={(e) => dispatch(setQRCodeRedicectoryLink(e.target.value))} 
          />
          {qrCodeState.type=="Premium" && <div
          onClick={()=>{if(linkInputRef.current){
            
            dispatch(setQRCodeType("Basic"))
            linkInputRef.current.focus()
          }}}
          className="font-bold text-sm absolute right-0 p-2 pr-4 cursor-pointer">Modifier</div>}
          </div>
      </div>
    <div className="flex flex-col gap-4 bg-white shadow-lg p-4 rounded-md">
      
      <div className="grid grid-cols-2 gap-6">
      <div className="items-center flex gap-4">
      <label htmlFor="QRCode-name-input" className="font-bold">Nom<span className="text-red-400">*</span></label>
      <div className="flex flex-col gap-2">
      <input
          className="p-1 outline-none bg-transparent border-2 border-gray-300 focus:border-primary-blue"
          id='QRCode-name-input'
          value={qrCodeState.name} 
          onChange={(e) => dispatch(setQRCodeName(e.target.value))} 
          />
          <p className="text-red-500 text-xs">{error.type=="name"?"Veuillez entrer un nom":null}</p>
          </div>
          </div>
         
          <div className="flex gap-4 items-center">
          <h3 className="font-bold">Niveau de correction</h3>
        <Select
        
          value={qrCodeState.correctionLevel}
          onChange={(e)=>dispatch(setCorrectionLevel(e.target.value))}
          className="border-2 border-gray-300 focus-within:border-primary-blue"
          sx={{
            height:'2.5rem',
            borderRadius:"0 !important",
            "*":{
              outline:"none !important",
              border:"none !important"
            }
          }}
          
        >
         
         <MenuItem value={"L"}>Faible</MenuItem>
         <MenuItem value={"M"}>Moyen</MenuItem>
         <MenuItem value={"Q"}>Quartile</MenuItem>
         <MenuItem value={"H"}>Élevé</MenuItem>
        </Select>
    
      </div>

      <div className="flex gap-4 items-center">
          <h3 className="font-bold">Marge</h3>
        <Select
        
          value={qrCodeState.margin}
          onChange={(e)=>dispatch(setMargin(e.target.value))}
          className="border-2 border-gray-300 focus-within:border-primary-blue"
          sx={{
            height:'2.5rem',
            minWidth:'4rem',
            borderRadius:"0 !important",
            "*":{
              outline:"none !important",
              border:"none !important"
            }
          }}
          
        >
         
         <MenuItem value={"0"}>0</MenuItem>
         <MenuItem value={"1"}>1</MenuItem>
         <MenuItem value={"2"}>2</MenuItem>
         <MenuItem value={"3"}>3</MenuItem>
         <MenuItem value={"4"}>4</MenuItem>
         <MenuItem value={"5"}>5</MenuItem>
        </Select>
    
      </div>
      </div>
    </div>
    <div className="flex flex-col gap-4 bg-white shadow-lg p-4 rounded-md">
      <h2 className="text-4xl">Couleurs</h2>
      <div className="flex gap-4">
        <ColorPicker 
          title="Couleur 1" 
          color={qrCodeState.darkColor} 
          action={setDarkColor} 
        />
        <ColorPicker 
          title="Couleur 2" 
          color={qrCodeState.lightColor} 
          action={setLightColor} 
        />
      </div>
    </div>
    <div className="flex gap-2 items-center">
      <BasicButton

      onClick={()=>handleSectionTransition()}

      style={{
        borderRadius:"100px",
        display:"flex",
        gap:'1rem'
      }}
      >{qrCodeState.type=="Premium"?"Continuer":"Terminer"}{isLoading?<AppSpinner variant="LIGHT" size={25}/>:<></>}</BasicButton>
      <button onClick={()=>dispatch(resetQRCodeSate(configurations.host+"/client/"+user?.name))} className='border-2 border-black rounded-full p-4 font-bold'>Réinitialiser</button>
      
    </div>
    </div>
  );
}

export default QrcodeEditorFirstSection;