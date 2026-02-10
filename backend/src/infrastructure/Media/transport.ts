import { getRoom } from "../services/rooms/roomManager";
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransportTypes";



export async function  createWebRtcTransport(roomId:string){
    const roomcreate = getRoom(roomId)

    if(!roomcreate){
        throw new Error("Room not Found")
    }
    const transport : WebRtcTransport =

      await roomcreate.router.createWebRtcTransport({
        listenIps: [
      {
       ip: "0.0.0.0",
       announcedIp: process.env.PUBLIC_IP
       }
      ],
     enableUdp: true,
     enableTcp: true,
     preferUdp: true

      })

      transport.on("dtlsstatechange",state=>{
        if(state==="closed"){
            transport.close()
        }
        
      })

      return {
      transport,
      params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
       
         }
          
      }

}