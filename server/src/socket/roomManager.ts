interface MatchRoom {
  matchId: string;
  transmitter: string | null; // socket.id
  receiver: string | null;    // socket.id
}

class RoomManager {
  private rooms: Map<string, MatchRoom> = new Map();

  getRoom(matchId: string): MatchRoom | undefined {
    return this.rooms.get(matchId);
  }

  join(matchId: string, socketId: string, role: 'transmitter' | 'receiver'): boolean {
    let room = this.rooms.get(matchId);
    if (!room) {
      room = { matchId, transmitter: null, receiver: null };
      this.rooms.set(matchId, room);
    }

    // Check if the role is already taken by another socket
    if (role === 'transmitter' && room.transmitter && room.transmitter !== socketId) {
      return false;
    }
    if (role === 'receiver' && room.receiver && room.receiver !== socketId) {
      return false;
    }

    if (role === 'transmitter') {
      room.transmitter = socketId;
    } else {
      room.receiver = socketId;
    }

    return true;
  }

  leave(socketId: string): { matchId: string; role: 'transmitter' | 'receiver' } | null {
    for (const [matchId, room] of this.rooms) {
      if (room.transmitter === socketId) {
        room.transmitter = null;
        if (!room.receiver) this.rooms.delete(matchId);
        return { matchId, role: 'transmitter' };
      }
      if (room.receiver === socketId) {
        room.receiver = null;
        if (!room.transmitter) this.rooms.delete(matchId);
        return { matchId, role: 'receiver' };
      }
    }
    return null;
  }

  getPlayerCount(matchId: string): number {
    const room = this.rooms.get(matchId);
    if (!room) return 0;
    return (room.transmitter ? 1 : 0) + (room.receiver ? 1 : 0);
  }

  getRoleForSocket(socketId: string): { matchId: string; role: 'transmitter' | 'receiver' } | null {
    for (const [matchId, room] of this.rooms) {
      if (room.transmitter === socketId) return { matchId, role: 'transmitter' };
      if (room.receiver === socketId) return { matchId, role: 'receiver' };
    }
    return null;
  }
}

export const roomManager = new RoomManager();
