const rooms = new Map()

export function getRoom(roomId: string) {
  return rooms.get(roomId)
}
