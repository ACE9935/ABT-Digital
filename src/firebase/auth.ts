import { InitialUser, SignUpErrors, SignUpResponse, User, LoginResponse, PwdResetResponse, PwdResetSecondResponse } from "@/types";
import { auth, } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { addUser } from "./addUser";
import { configurations } from "@/app-configurations";
import axios from "axios";
import { getUserFromEmail } from "./getUserFromEmail";
import { generateClientAccessToken } from "@/utils/generateClientAccessToken";
import generateRandomId from "@/utils/generateRandomId";
var validator = require('validator');

export const doCreateUserWithEmailAndPassword = async ({userName,name,email, pwd,rePwd,acceptPlcs,phone}:InitialUser):Promise<SignUpResponse> => {
  const errors:SignUpErrors={error:{userName:"",name:"",email:"",pwd:"",rePwd:"",phone:"",acceptPlcs:""}}
  
  if (!name) errors.error.name = "Un nom est requis";
  if (!userName) errors.error.userName = "Un nom est requis";
  // Check if email is provided and is valid
  if (!email) {
    errors.error.email = "Une adresse e-mail est requise";
    return {errors:errors,status:"ERROR"}
  } else if (!validator.isEmail(email)) {
    errors.error.email = "Veuillez fournir une adresse e-mail valide";
    return {errors:errors,status:"ERROR"}
  }

  // Check if password is provided and meets criteria
  if (!pwd) {
    errors.error.pwd = "Un mot de passe est requis";
    return {errors:errors,status:"ERROR"}
  } else if (pwd.length < 6) {
    errors.error.pwd = "Le mot de passe doit comporter au moins 6 caractères";
    return {errors:errors,status:"ERROR"}
  }

  // Check if re-entered password matches the original password
  if (pwd !== rePwd) {
    errors.error.rePwd = "Les mots de passe ne correspondent pas";
    return {errors:errors,status:"ERROR"}
  }

  // Check if phone number is provided and is valid
  /*if (!phone) {
    errors.error.phone = "Un numéro de téléphone est requis";
    return {errors:errors,status:"ERROR"}
  } else if (!validator.isMobilePhone(phone,false)) {
    errors.error.phone = "Veuillez fournir un numéro de téléphone valide";
    return {errors:errors,status:"ERROR"}
  }*/

  // Check if terms and conditions are accepted
  if (!acceptPlcs) {
    errors.error.acceptPlcs = "Veuillez cocher cette case";
    return {errors:errors,status:"ERROR"}
  }

  try {
    await createUserWithEmailAndPassword(auth, email, pwd);

    // Update user profile with name
    if (auth.currentUser) {
      const data:User={userName,name,email,phone,acceptPlcs,id:auth.currentUser.uid,emailVerified:false,photoUrl:configurations.userImg,qrCodes:[],clients:[],clientEmails:[],clientPhoneNumbers:[],automatedNotifications:[]}
      await updateProfile(auth?.currentUser, { displayName: name,photoURL:data.photoUrl })
            .then(async user=>{
              
              const newUser=await addUser(data,"Email")
              const accessToken=await auth?.currentUser?.getIdToken()
              if(auth.currentUser) await axios.post('/api/send-verification-email', {
                email:newUser?.email!,
                token:newUser?.verificationToken,
                id:newUser?.id,
                accessToken:accessToken
               });
            })
    }

    // Return success status if everything is successful
    return { errors: null, status: "OK",method:"credentials" };
  } catch (error:any) {

      // Firebase authentication error
      if (error.code === 'auth/email-already-in-use') {
        // Handle the case where the email is already in use
        errors.error.email = "L'adresse e-mail est déjà associée à un autre compte";
        return { errors: errors, status: "ERROR" };
      }else {
      // Handle other types of errors
      console.error('Error creating account:', error);
      // Set a generic error message or handle it based on your requirement
    }

    return { errors: { error: { ...errors.error, email: "Une erreur s'est produite lors de la création du compte." } }, status: "ERROR" };
  }
};

export const doSignInWithEmailAndPassword = async (email:string, password:string):Promise<LoginResponse> => {

  try{
  const result = await signInWithEmailAndPassword(auth, email, password)
  if(!result.user.emailVerified) return {errorMsg: "Veuillez vérifier votre email pour vous connecter", status: "ERROR"}
  return {errorMsg:null,status:"OK"}
} catch (error:any) {

  if (error.code === 'auth/invalid-email') {
    // Handle the case where the emai is invalid

    return { errorMsg:"Veuillez fournir une adresse e-mail valide", status: "ERROR" };
  }
  if (error.code === 'auth/invalid-credential'||error.code === 'auth/missing-password') {
    // Handle the case where the user is unfound

    return { errorMsg:"Utilisateur introuvable. Veuillez vérifier votre email et mot de passe", status: "ERROR" };
  }else {
  // Handle other types of errors
  console.error('Error login:', error);
  // Set a generic error message or handle it based on your requirement
}

return { errorMsg:'Une erreur est survenue, veuillez réessayer ultérieurement', status: "ERROR" };
}};

export const doSignInWithGoogle = async ():Promise<SignUpResponse> => {
  
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const data:User={userName:`user${generateRandomId(6)}`,name:user.displayName!,email:user.email!,emailVerified:user.emailVerified,id:user.uid,acceptPlcs:true,phone:user.phoneNumber,photoUrl:user.photoURL!,qrCodes:[],clients:[],clientEmails:[],clientPhoneNumbers:[],automatedNotifications:[]}
  await addUser(data,"Google")
  return { errors: null, status: "OK",method:"google" };      
};

export const doSignOut = () => {
  return auth.signOut();
};

export const resetPassword = async (email:string): Promise<PwdResetResponse> => {
  try {
    if(!validator.isEmail(email)) return { errorMsg:'Veuillez fournir une adresse e-mail valide', status: "ERROR" };

    const user = await getUserFromEmail(email);
    if(!user) return { errorMsg:'Utilisateur introuvable. Veuillez vérifier votre email', status: "ERROR" };

    const response = await axios.post('/api/send-password-reset-link', {
      email: email
    });

    // Return success status if everything is successful
    return { errorMsg: null, status: "OK" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { errorMsg: "Une erreur est survenue, veuillez réessayer ultérieurement", status: "ERROR" };
  }
}

export const updatePassword = async (pwd:string,rePwd:string,token:string,id:string): Promise<PwdResetSecondResponse> => {
  const errors={pwd:"",rePwd:""};
  try {
    if (!pwd) {
      errors.pwd = "Un mot de passe est requis";
      return {errors:errors,status:"ERROR"}
    } else if (pwd.length < 6) {
      errors.pwd = "Le mot de passe doit comporter au moins 6 caractères";
      return {errors:errors,status:"ERROR"}
    }
  
    // Check if re-entered password matches the original password
    if (pwd !== rePwd) {
      errors.rePwd = "Les mots de passe ne correspondent pas";
      return {errors:errors,status:"ERROR"}
    }

      await axios.post('/api/set-password', {
      password:pwd,
      token,
      id
    });

    // Return success status if everything is successful
    return { errors: null, status: "OK" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { errors: {pwd:"Une erreur est survenue, veuillez réessayer ultérieurement",rePwd:""}, status: "ERROR" };
  }
}