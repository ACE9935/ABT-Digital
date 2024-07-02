import { createSlice } from '@reduxjs/toolkit'
import { ClientPageState, QRCode } from '@/types'

const initialState:ClientPageState={
    providerId:null,
    client:{
        infos:{
            name:"",
            email:"",
            phoneNumber:"",
            submitDate:""
        }
    },
    qrCode:null
}
  
  export const ClientPageSlice = createSlice({
    name: 'client-page',
    initialState:initialState,
    reducers: {
        setProviderId:(state,action)=>({...state,providerId:action.payload}),
        setQRCode:(state,action)=>({...state,qrCode:action.payload}),
        setClientName:(state,action)=>{state.client.infos.name=action.payload},
        setClientEmail:(state,action)=>{state.client.infos.email=action.payload},
        setClientPhoneNumber:(state,action)=>{state.client.infos.phoneNumber=action.payload},
    },
  })

export const { setProviderId,setQRCode, setClientEmail,setClientPhoneNumber,setClientName } = ClientPageSlice.actions

export default ClientPageSlice.reducer