

   export const configurations = {
    appName: "ABT-Digital",
    bluetheme: "rgb(94, 123, 238)",
    host: "https://abt-digital.vercel.app",
    staticQrCode: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/40415-bdc-qr-code.webp?alt=media&token=524eddee-f350-4466-a8ad-f2759bb0c9c5",
    darkSpinner: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/Rolling%401.5x-1.0s-200px-200px%20(1).gif?alt=media&token=6c4c257f-c455-49fb-b9ce-adfa5335d8bd",
    lightSpinner: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/Rolling%401.5x-1.0s-200px-200px%20(2).gif?alt=media&token=9ec69938-06c6-457b-a2b3-38866f0a79af",
    userImg: "https://firebasestorage.googleapis.com/v0/b/abt-digital.appspot.com/o/user.png?alt=media&token=9c8c42cf-a46c-4243-9ba3-a522c4d3e9e2",
    client: {
      desktopImg: "https://wallpaper.forfun.com/fetch/21/215e3ddf9d2d722a16e435992d354932.jpeg",
      introductorytext: "Laisse-nous un avis, cela nous aidera à nous développer et à mieux servir nos clients, comme toi."
    }
  };

export const genericEmail=(brandName:string)=>`Bonjour,<br/>
<br/>
Merci d'avoir visité ${brandName}. Nous espérons que vous avez passé un agréable moment.
<br/><br/>
Au plaisir de vous revoir bientôt !
<br/><br/>
Cordialement,`

export const genericSMS=(brandName:string)=>`Bonjour,\n
Merci d'avoir visité ${brandName}. Nous espérons que vous avez passé un agréable moment.
Au plaisir de vous revoir bientôt !
\n
Cordialement,`

export const genericEmailSubject=(brandName:string)=>`Merci pour votre visite chez ${brandName} !`
