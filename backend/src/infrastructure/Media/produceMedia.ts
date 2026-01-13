import { getRoom } from "../../applications/rooms/roomManager";

export async function ProduceMedia(
    roomId: string,
  transportId: string,
  kind: "audio" | "video",
  rtpParameters: any
){
  
    const room = getRoom(roomId)
    if(!room){
        throw new Error("room not found")
    }
     const transport = room.transports.get(transportId)
  if (!transport) throw new Error("Transport not found")

  const producer = await transport.produce({
    kind,
    rtpParameters
  })

  room.producers.set(producer.id, producer)

  producer.on("transportclose", () => {
    room.producers.delete(producer.id)
  })

  return producer.id
}