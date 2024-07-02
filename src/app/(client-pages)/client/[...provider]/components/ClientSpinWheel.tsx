import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../client-state/hooks";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where, doc as firestoreDoc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Confetti from 'react-confetti'
import { Box, Modal } from "@mui/material";
import useWindowSize from "react-use/lib/useWindowSize";
import dynamic from "next/dynamic";
const Wheel = dynamic(() => import('react-custom-roulette').then(mod => mod.Wheel), { ssr: false });

export async function incrementWinners(userId: string, qrCodeId: string) {
    try {
        // Query the collection for the document with the specified id field value
        const collectionRef = collection(db, 'users');
        const q = query(collectionRef, where("id", "==", userId));
        const querySnapshot = await getDocs(q);

        // Check if any documents match the query
        if (!querySnapshot.empty) {
            // Iterate over each matching document
            querySnapshot.forEach(async (docSnapshot) => {
                const data = docSnapshot.data();
                if (data.qrCodes && Array.isArray(data.qrCodes)) {
                    // Find the QR code item by ID
                    const qrCodeIndex = data.qrCodes.findIndex((code: any) => code.id === qrCodeId);

                    if (qrCodeIndex !== -1) {
                        // Increment the winners field
                        data.qrCodes[qrCodeIndex].winners = (data.qrCodes[qrCodeIndex].winners || 0) + 1;
                        data.qrCodes[qrCodeIndex].winnersPerDay = (data.qrCodes[qrCodeIndex].winnersPerDay || 0) + 1;
                        data.qrCodes[qrCodeIndex].winnersPerWeek = (data.qrCodes[qrCodeIndex].winnersPerWeek || 0) + 1;
                        data.qrCodes[qrCodeIndex].winnersPerMonth = (data.qrCodes[qrCodeIndex].winnersPerMonth || 0) + 1;

                        // Update the document
                        const docRef = firestoreDoc(collection(db, 'users'), docSnapshot.id);
                        await updateDoc(docRef, { qrCodes: data.qrCodes });

                        console.log('Winners incremented successfully.');
                    } else {
                        console.log('QR code not found.');
                    }
                } else {
                    console.log('The document does not contain a qrCodes array.');
                }
            });
        } else {
            console.log("No matching documents found.");
        }
    } catch (error) {
        console.error("Error updating document field:", error);
    }
}  

export async function addStopTokenToMatchingElement(userId: string, fieldToUpdate: string, contentToMatch: string, stopToken: string) {
    try {
        // Query the 'users' collection for the document with the specified field value
        const collectionRef = collection(db, 'users');
        const q = query(collectionRef, where("id", "==", userId));
        const querySnapshot = await getDocs(q);

        // Check if any documents match the query
        if (!querySnapshot.empty) {
            // Iterate over each matching document
            querySnapshot.forEach(async (doc) => {
                const docData = doc.data();
                const arrayField = docData[fieldToUpdate] as Array<any>;

                // Find the element to update
                const elementIndex = arrayField.findIndex(item => item.content === contentToMatch);

                if (elementIndex !== -1) {
                    // Element found, add the stopToken field
                    const updatedElement = { ...arrayField[elementIndex], stopToken };
                    arrayField[elementIndex] = updatedElement;

                    // Update the document in Firestore
                    const docRef = firestoreDoc(collection(db, "users"), doc.id);
                    await updateDoc(docRef, {
                        [fieldToUpdate]: arrayField
                    });

                    console.log("Document field successfully updated with stopToken!");
                } else {
                    console.log("No matching element found in array field.");
                }
            });
        } else {
            console.log("No matching documents found.");
        }
    } catch (error) {
        console.error("Error updating document field:", error);
    }
}

function ClientSpinWheel() {

    const globalState = useAppSelector(state => state.client);
    const dispatch = useAppDispatch();
    const [mustSpin,setMustSpin]=useState(false)
    const [prizeNumber,setPrizeNumber]=useState<number>(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { width, height } = useWindowSize()
    const [isExploding, setIsExploding] = useState(false);
    const [hasPlayed,setHasPlayed]=useState(false)

    const hasWon=globalState.qrCode?.meta.spinWheelData.options[prizeNumber].option.length || false

    const handleClientPlay = async ()=>{

        localStorage.removeItem('clientAccessToken');

        const response:any = await axios.post('/api/generate-stop-token', { clientInfo:globalState.client.infos.phoneNumber })
            .then((x)=>{
                addStopTokenToMatchingElement(globalState.providerId!, "clientPhoneNumbers","+"+globalState.client.infos.phoneNumber,x.data.data)
            })
        if(hasWon) await incrementWinners(globalState.providerId!,globalState.qrCode?.id!)
    
    }    

    return ( 
    <div className="p-9 rounded-lg w-full max-w-[34rem] flex flex-col items-center">
        <div className="flex flex-col gap-4">
        <img src={globalState.qrCode?.meta.logoImg} className="w-auto h-[6rem] self-center"/>
        <p className="text-lg text-center font-medium text-slate-600 relative pb-6">Tournez la roue du jeu pour tenter votre chance et remporter un cadeau !</p>
        </div>
        <Modal open={isOpen} onClose={onClose} disableAutoFocus>
            <>
            {hasWon&&<Confetti
             recycle={false}
             width={width}
             height={height}
            />}
             <Box sx={{
             position: 'absolute',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             }}>
              <motion.div
              initial={{scale:0}}
              animate={{scale:1}}
              className='p-6 sm:px-14 flex flex-col items-center gap-6 rounded-md w-[30rem] bg-slate-100'
              transition={{type:"spring"}}
              >
              {hasWon?
              <>
              <h1 className='text-center text-2xl'>Félicitations !</h1>
              <div className='text-center'>
              Vous avez gagné un prix à notre jeu de roulette:

              <div className="font-bold text-2xl py-2">{globalState.qrCode?.meta.spinWheelData.options[prizeNumber].option}</div>
            
               Consultez votre messagerie SMS pour plus d'informations.
              </div>
              </>
              :
              <>
              <h1 className='text-center text-2xl'>Dommage !</h1>
              <p className='text-center'>
              Vous n'avez pas gagné cette fois-ci, mais ne vous découragez pas. La chance tournera en votre faveur la prochaine fois.
              </p>
              </>
              }
              <button onClick={onClose} className="bg-primary-color rounded-full text-white px-6 p-4 font-bold">Fermer</button>
              </motion.div>
             </Box>
             </>
            </Modal>
        <Wheel
            fontSize={16}
             mustStartSpinning={mustSpin}
             onStopSpinning={async ()=>{
                onOpen()
                setMustSpin(false)
                setIsExploding(true)
                await handleClientPlay()
              }}
             prizeNumber={prizeNumber}
             data={globalState.qrCode?.meta.spinWheelData.options?globalState.qrCode?.meta.spinWheelData.options.map(o=>({
              option:o.option,
              optionSize:o.size,
        
              })):[]}
             backgroundColors={globalState.qrCode?.meta.spinWheelData.bgColors}
             textColors={globalState.qrCode?.meta.spinWheelData.textColor}
             />
             <button
             onClick={async ()=>{
                if(!hasPlayed){setHasPlayed(true)
                setMustSpin(true)
                setPrizeNumber(Math.floor(Math.random() * globalState.qrCode?.meta.spinWheelData.options.length!))}
               }}
             className="bg-primary-color font-bold text-white p-4 rounded-full px-6 disabled:opacity-[0.6]" disabled={hasPlayed}>Tourner</button>
        </div>
     );
}

export default ClientSpinWheel;