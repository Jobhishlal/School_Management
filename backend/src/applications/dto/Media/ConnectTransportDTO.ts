export interface ConnectTransportDTO {
  roomId: string
  transportId: string
  dtlsParameters: ReturnType<typeof JSON.parse>   
}
