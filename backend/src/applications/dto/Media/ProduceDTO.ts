export interface ProduceDTO {
  roomId: string
  transportId: string
  kind: "audio" | "video"
  rtpParameters: ReturnType<typeof JSON.parse>
}
