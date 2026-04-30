import { ProduceMedia } from "../Media/produceMedia"
import { ProduceDTO } from "../../applications/dto/Media/ProduceDTO"



  export default function socketHandler(io: ReturnType<typeof JSON.parse>) {
      io.on("connection", (socket: ReturnType<typeof JSON.parse>) => {

    socket.on(
      "produce",
      async (
        data: ProduceDTO,
        callback: (response: { producerId?: string; error?: string }) => void
      ) => {
        try {
          const producerId = await ProduceMedia(
            data.roomId,
            data.transportId,
            data.kind,
            data.rtpParameters
          )

          callback({ producerId })
        } catch (error: unknown) {
          callback({ error: (error as Error).message })
        }
      }
    )

  })
}