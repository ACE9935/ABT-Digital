"use client"

import ClientInput from "@/app/(client-pages)/client/[...provider]/components/ClientInput";
import styled from '@emotion/styled';
import resolveConfig from 'tailwindcss/resolveConfig';
import Config from "../../../../../../tailwind.config";
import { useEffect, useState } from "react";
import { EmailInterface, User } from "@/types";
import 'react-quill/dist/quill.snow.css'; 
import { genericEmail, genericEmailSubject } from "@/app-configurations";
import axios from 'axios';
import AppSpinner from "@/components/AppSpinner";
import { useUser } from "@/context/authContext";
import { useToast } from "@chakra-ui/react";
import AppToast from "@/components/AppToast";
import { Check } from "@mui/icons-material";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill'))

const tailwindConfig = resolveConfig(Config);
const colors = tailwindConfig.theme?.colors as unknown as { [key: string]: string };
const primaryBlue = colors["primary-black"];

const StyledTextArea = styled(ReactQuill)`
   .ql-editor:hover{
    outline-width:2px
   }
   .ql-editor:focus{
    outline: 2px solid ${primaryBlue || "black"}; 
   }
   .ql-editor{
   outline:1px solid lightgray;
   min-height:18rem;
   }
`;

function EmailCustomizerForm({automate, automateValue,automateType}:{automate:boolean,automateType: string, automateValue:string}) {

   const [email, setEmail] = useState<EmailInterface>({ sender: "[Nom de la Marque]", subject: "Merci pour votre visite chez [Nom de la Marque] !", email: "" });
   const [loading, setLoading] = useState(false);
   const { user, updateUser } = useUser();
   const toast = useToast();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await axios.post('/api/send-client-email', {userId: user?.id,emails:user?.clientEmails,emailContent:email.email,subject:email.subject,automate, sender: email.sender, automateValue, automateType});
         await updateUser()
         console.log('Email sent successfully:', response.data);
         // Handle success response
      } catch (error) {
         console.error('Error sending email:', error);
         // Handle error response
      } finally {
         setLoading(false);
         toast({
            position: 'bottom-left',
            render: () => (
              <AppToast variant="SUCCESS" title="Email envoyé" Icon={Check} />
            ),
          });
      }
   };

   useEffect(()=>{
      if(user)setEmail(prev => ({ sender: user.name, subject: genericEmailSubject(user.name), email: genericEmail(user.name) }));
   },[user])

   return (
      <>{user && <div>
         <form className="flex flex-col gap-3 py-6" onSubmit={handleSubmit}>
            <div>
               <label htmlFor="sender-name" className="font-bold pb-1 block">Customize the sender</label>
               <ClientInput
                  id="sender-name"
                  value={email.sender}
                  onChange={(e) => setEmail(prev => ({ ...prev, sender: e.target.value }))}
               />
            </div>
            <div>
               <label htmlFor="email-subject" className="font-bold pb-1 block">Customize the subject</label>
               <ClientInput
                  id="email-subject"
                  value={email.subject}
                  onChange={(e) => setEmail(prev => ({ ...prev, subject: e.target.value }))}
               />
            </div>
            <div>
               <label htmlFor="email-body" className="font-bold pb-1 block">Customize the message</label>
               <StyledTextArea
                  id="email-body"
                  className={`w-full !font-semibold transition-all `}
                  value={email.email}
                  onChange={(e) => setEmail(prev => ({ ...prev, email: e }))}
                  modules={{
                     toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean']
                     ]
                  }}
               />
            </div>
            <div className="mt-8 flex justify-end gap-3">
               <button
                  className="p-3 rounded-md font-bold text-md bg-primary-color text-white flex gap-2"
                  type="submit"
                  disabled={loading}
               >
                 <>{loading&&<AppSpinner variant="LIGHT" size={25}/>}Envoyer</>
               </button>
            </div>
         </form>
         <div>
         </div>
      </div>}</>
   );
}

export default EmailCustomizerForm;