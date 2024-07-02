"use client"
import { auth, db } from "@/firebase/firebase";
import { User, UserQRCode } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WeeklyChart } from "./charts/WeeklyChart";
import { MonthlyChart } from "./charts/MonthlyChart";
import { YearlyChart } from "./charts/YearlyChart";
import { compareWeeklyScanProgress, compareWeeklyWinnersProgress, getDaysInMonth, getScansPerDayOfMonth, getScansPerMonthOfYear, getWeekScansData, getWeekWinnersData, getWinnersPerDayOfMonth, getWinnersPerMonthOfYear, months } from "@/utils/chartUtilityFunctions";
import { ArrowDownward, ArrowUpward, Check } from "@mui/icons-material";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { Modal } from "@mui/material";
import { getFirestore, collection, query, where, getDocs, doc as firestoreDoc, updateDoc, arrayRemove } from "firebase/firestore"; 
import AppSpinner from "@/components/AppSpinner";
import { useRouter } from "next/navigation";
import AppToast from "@/components/AppToast";
import { useUser } from "@/context/authContext";
import QrcodeStatsSkeleton from "./QrcodeStatsSkeleton";
import ClientInput from "@/app/(client-pages)/client/[...provider]/components/ClientInput";
import { getPastWeekDays } from "@/utils/getPastWeekDays";
import { configurations } from "@/app-configurations";

export interface ChartProps {
  title:string
  color:string
  secondaryColor:string
  xAxis:any
  yAxis:any
  qrCode:UserQRCode
  label:string
  chartType: "weekly" | "monthly" | "yearly"
  setChartType:Dispatch<SetStateAction<"weekly" | "monthly" | "yearly">>
}

function ScansInfoCard({title,data,color}:{title:string,data:number,color:string}) {
  return ( 
    <div className="bg-white shadow-lg rounded-md p-4 flex flex-col gap-3">
                        <div className="font-bold">{title}</div>
                        <div className={`font-bol text-3xl border-l-[0.3rem] ${color} pl-2`}>
                            {data}
                        </div>
                    </div>
   );
}

function QrcodeStatsContainer({ qrCodeId }: { qrCodeId: string }) {

    const {user,updateUser}=useUser()
    const qrcode=user?.qrCodes?.find(o => o.id == qrCodeId)!
    const [chartType, setChartType] = useState<"weekly" | "monthly" | "yearly">("weekly");
    const [chartTypeY, setChartTypeY] = useState<"weekly" | "monthly" | "yearly">("weekly");
    const scansProgress=qrcode?compareWeeklyScanProgress(qrcode,new Date()):0
    const winnersProgress=qrcode?compareWeeklyWinnersProgress(qrcode,new Date()):0
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen:isOpenY, onOpen:onOpenY, onClose:onCloseY } = useDisclosure()
    const [loading,setLoading]=useState(false)
    const router=useRouter()
    const toast = useToast()
    const [newLink,setLink]=useState("")

    useEffect(()=>{
     if(qrcode) setLink(qrcode?.redirectoryLink!)
    },[user])

 
    async function updateQRCodeRedirect(userId: string, qrCodeId: string, newRedirectUrl: string) {
  
      try {
          setLoading(true);
  
          // Query the collection for the document with the specified id field value
          const collectionRef = collection(db, 'users');
          const q = query(collectionRef, where("id", "==", userId));
          const querySnapshot = await getDocs(q);
  
          // Check if any documents match the query
          if (!querySnapshot.empty) {
              // Iterate over each matching document
              querySnapshot.forEach(async (doc) => {
                  // Document found, get the reference
                  const docRef = firestoreDoc(collection(db, "users"), doc.id);
  
                  // Get the current document data
                  const docData = doc.data();
                  const fieldArray = docData["qrCodes"] || [];
  
                  // Find the QR code to be updated
                  const qrCodeToUpdate = fieldArray.find((qrCode: UserQRCode) => qrCode.id === qrCodeId);
  
                  if (qrCodeToUpdate) {
                      // Update the redirectUrl field of the specific QR code
                      await updateDoc(docRef, {
                          ["qrCodes"]: fieldArray.map((qrCode: UserQRCode) => {
                              if (qrCode.id === qrCodeId) {
                                  return { ...qrCode, redirectoryLink: newRedirectUrl };
                              }
                              return qrCode;
                          })
                      });
                      await updateUser();
                      onCloseY()
                      console.log("QR code redirectUrl successfully updated in the document field!");
                  } else {
                      console.log("No matching QR code found in the field.");
                  }
              });
          } else {
              console.log("No matching documents found.");
          }
           // Uncomment if updateUser is a defined function
          toast({
              position: 'bottom-left',
              render: () => (
                  <AppToast variant="SUCCESS" title="QR code mis à jour" Icon={Check} />
              ),
          });
  
      } catch (error) {
          console.error("Error updating document field:", error);
      } finally {
          setLoading(false);
      }
  }

    async function deleteQRCode(userId:string, qrCodeId:string) {
      try {
          setLoading(true)
          // Query the collection for the document with the specified id field value
          const collectionRef = collection(db, 'users'); 
          const q = query(collectionRef, where("id", "==", userId));
          const querySnapshot = await getDocs(q);
    
          // Check if any documents match the query
          if (!querySnapshot.empty) {
              // Iterate over each matching document
              querySnapshot.forEach(async (doc) => {
                  // Document found, get the reference
                  const docRef = firestoreDoc(collection(db, "users"), doc.id);
    
                  // Get the current document data
                  const docData = doc.data();
                  const fieldArray = docData["qrCodes"] || [];
    
                  // Find the QR code to be removed
                  const qrCodeToRemove = fieldArray.find((qrCode:UserQRCode) => qrCode.id === qrCodeId);
    
                  if (qrCodeToRemove) {
                      // Remove the specific QR code from the array field
                      await updateDoc(docRef, {
                          ["qrCodes"]: arrayRemove(qrCodeToRemove)
                      });
                      await updateUser()
                      console.log("QR code successfully removed from the document field!");
                  } else {
                      console.log("No matching QR code found in the field.");
                  }
              });
          } else {
              console.log("No matching documents found.");
          }
      } catch (error) {
          console.error("Error updating document field:", error);
      }
      finally{
        setLoading(false)
        router.push("/dashboard/qrcodes")
        toast({
          position: 'bottom-left',
          render: () => (
            <AppToast variant="SUCCESS" title="QR code supprimé" Icon={Check}/>
          ),
        })

      }
    }
    

    const chartsY: { [key: string]: JSX.Element | null } = qrcode ? {
        weekly: <WeeklyChart title="Évolution des gagnants au jeu roulette" color="#ea580c" secondaryColor="orange" label="gagnant" qrCode={qrcode} xAxis={getPastWeekDays} yAxis={getWeekWinnersData} chartType={chartType} setChartType={setChartType}/>,
        monthly: <MonthlyChart title="Évolution des gagnants au jeu roulette" color="#ea580c" secondaryColor="orange" label="gagnant" qrCode={qrcode} xAxis={getDaysInMonth} yAxis={getWinnersPerDayOfMonth} chartType={chartType} setChartType={setChartType}/>,
        yearly: <YearlyChart title="Évolution des gagnants au jeu roulette" color="#ea580c" secondaryColor="orange" label="gagnant" qrCode={qrcode} xAxis={months} yAxis={getWinnersPerMonthOfYear} chartType={chartType} setChartType={setChartType}/>
    } : { weekly: null, monthly: null, yearly: null };

    const charts: { [key: string]: JSX.Element | null } = qrcode ? {
      weekly: <WeeklyChart title="Évolution des scans" color={configurations.bluetheme} secondaryColor="blue" label="scan" qrCode={qrcode} xAxis={getPastWeekDays} yAxis={getWeekScansData} chartType={chartType} setChartType={setChartType}/>,
      monthly: <MonthlyChart title="Évolution des scans" color={configurations.bluetheme} secondaryColor="blue" label="scan" qrCode={qrcode} xAxis={getDaysInMonth} yAxis={getScansPerDayOfMonth} chartType={chartType} setChartType={setChartType}/>,
      yearly: <YearlyChart title="Évolution des scans" color={configurations.bluetheme} secondaryColor="blue" label="scan" qrCode={qrcode} xAxis={months} yAxis={getScansPerMonthOfYear} chartType={chartType} setChartType={setChartType}/>
  } : { weekly: null, monthly: null, yearly: null };

    return (
        <>
            {user? 
            <div className="p-3">
              <Modal open={isOpen} onClose={()=>{
                onClose()
              }} disableAutoFocus>
                <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  }}
                className="bg-white rounded-md p-6 flex gap-7 flex-col">
                  <p className="text-xl">
                  Voulez-vous vraiment supprimer votre QR code ?</p>

                  <div className="flex gap-3">
                   <button className="border-2 border-primary-color font-bold text-black rounded-full p-3 flex gap-2 items-center" onClick={onClose}>Annuler</button>
                   <button onClick={()=>deleteQRCode(auth.currentUser?.uid!,qrcode.id)} className="bg-primary-color font-bold text-white rounded-full p-3 flex gap-2 items-center">{loading&&<AppSpinner variant="LIGHT" size={26}/>}Supprimer</button>
                  </div>
                </div>
              </Modal>
              <Modal open={isOpenY} onClose={()=>{
                setLink(qrcode.redirectoryLink!)
                onCloseY()
              }} disableAutoFocus>
                <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  }}
                className="bg-white rounded-md p-6 flex gap-7 flex-col">
                  <p className="text-xl">
                  Modifiez le lien de redirection de votre code QR</p>
                  <div className="flex flex-col gap-2 w-full max-w-[22rem]">
            <label htmlFor="url-input" className="font-bold">Lien URL</label>
            <ClientInput
            error={!newLink?.length}
            value={newLink}
            style={{width:"100% !important"}}
            onChange={(e)=>{
                setLink(e.target.value)
            }}
            id="url-input"
            label=""
            />
            </div>
                  <div className="flex gap-3">
                   <button className="border-2 border-primary-color font-bold text-black rounded-full p-3 flex gap-2 items-center" onClick={()=>{
                    setLink(qrcode.redirectoryLink!)
                    onCloseY()
                   }}>Annuler</button>
                   <button disabled={!newLink} onClick={()=>updateQRCodeRedirect(user.id,qrCodeId,newLink!)} className="bg-primary-color font-bold text-white rounded-full p-3 flex gap-2 items-center">{loading&&<AppSpinner variant="LIGHT" size={26}/>}Modifier</button>
                  </div>
                </div>
              </Modal>
              <div className="p-3 pb-6">
                <h1 className="text-3xl font-bold pb-2">Statistiques du Code QR</h1>
                <p className="text-slate-600 text-lg">Découvrez ici les statistiques clés de votre QR code </p>
              </div>
            <div className="flex p-3 gap-3"><div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
            <div className="bg-primary-blue text-white p-3 rounded-t-xl font-bold text-center">{qrcode.name}</div>
             <img src={qrcode.url} className="w-full max-w-[18rem]"/>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={qrcode.type=="Premium"?()=>router.push(`/dashboard/edit-qrcode/${qrCodeId}`):onOpenY} className="bg-primary-color text-white font-bold rounded-full p-3">Modifier</button>
                <button onClick={onOpen} className="border-2 border-red-500 font-bold text-red-600 rounded-full p-2 hover:bg-red-500 hover:text-white transition-all">Supprimer</button>
              </div>
            </div>
            <div>
                {charts[chartType]}
                <div className="grid grid-cols-3 gap-3 py-3">
                    <div className="bg-white shadow-lg rounded-md p-4 flex flex-col gap-3">
                        <div className="font-bold">Total Scan</div>
                        <div className="flex gap-6 items-center">
                            <div className="font-bol text-3xl border-l-[0.3rem] border-primary-blue pl-2">{qrcode.scans}</div>
                            {scansProgress!=0?<div className="flex gap-1 items-center">{scansProgress>0?<ArrowUpward className="text-green-600"/>:<ArrowDownward className="text-red-500"/>}<div className="text-2xl text-slate-600">{scansProgress>0?"+":""}{scansProgress}</div></div>:<></>}
                        </div>
                    </div>
                    <ScansInfoCard color="border-primary-blue" title="Scans ce jour" data={qrcode.scansPerDay}/>
                    <ScansInfoCard color="border-primary-blue" title="Scans cette semaine" data={qrcode.scansPerWeek}/>
                    <ScansInfoCard color="border-primary-blue" title="Scans ce mois" data={qrcode.scansPerMonth}/>

                </div>
                {qrcode.type=="Premium" && <div>
                {chartsY[chartType]}
                <div className="grid grid-cols-3 gap-3 py-3">
                    <div className="bg-white shadow-lg rounded-md p-4 flex flex-col gap-3">
                        <div className="font-bold">Total gagnants</div>
                        <div className="flex gap-6 items-center">
                            <div className="font-bol text-3xl border-l-[0.3rem] border-amber-500 pl-2">{qrcode.winners}</div>
                            {winnersProgress!=0?<div className="flex gap-1 items-center">{winnersProgress>0?<ArrowUpward className="text-green-600"/>:<ArrowDownward className="text-red-500"/>}<div className="text-2xl text-slate-600">{winnersProgress>0?"+":""}{winnersProgress}</div></div>:<></>}
                        </div>
                    </div>
                    <ScansInfoCard color="border-amber-500" title="Gagnants ce jour" data={qrcode.winnersPerDay}/>
                    <ScansInfoCard color="border-amber-500" title="Gagnants cette semaine" data={qrcode.winnersPerWeek}/>
                    <ScansInfoCard color="border-amber-500" title="Gagnants ce mois" data={qrcode.winnersPerMonth}/>

                </div>
            </div>}
            </div>
            </div>
            </div>:<QrcodeStatsSkeleton/>}
        </>
    );
}

export default QrcodeStatsContainer;