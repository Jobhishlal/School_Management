import { getRoom } from "../services/rooms/roomManager";

export async function connectWebRtcTransport(
     roomId: string,
  transportId: string,
  dtlsParameters: any
){

    const room = getRoom(roomId)
    if(!room){
        throw new Error("Room not found")
    }

    const transport = room.transport.get(transportId)
    if(!transport){
        throw new Error("transport not found")
    }

    await transport.connect({dtlsParameters})

}