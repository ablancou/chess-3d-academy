import { Peer, DataConnection } from "peerjs";

export type PeerStatus = "disconnected" | "connecting" | "hosting" | "connected" | "error";

type MoveMessage = {
  type: "move";
  from: string;
  to: string;
  promotion?: string;
};

type SyncMessage = {
  type: "sync";
  fen: string;
};

type PeerMessage = MoveMessage | SyncMessage;

export class PeerService {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;

  public hostId: string | null = null;
  
  public onStatusChange: (status: PeerStatus) => void = () => {};
  public onMoveReceived: (from: string, to: string, promotion?: string) => void = () => {};

  public hostGame(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.onStatusChange("connecting");
      this.peer = new Peer();

      this.peer.on("open", (id) => {
        this.hostId = id;
        this.onStatusChange("hosting");
        resolve(id);
      });

      this.peer.on("connection", (conn) => {
        this.connection = conn;
        this.setupConnection();
        this.onStatusChange("connected");
      });

      this.peer.on("error", (err) => {
        console.error("PeerJS Error:", err);
        this.onStatusChange("error");
        reject(err);
      });
    });
  }

  public joinGame(hostId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onStatusChange("connecting");
      this.peer = new Peer();

      this.peer.on("open", () => {
        this.connection = this.peer!.connect(hostId);
        
        this.connection.on("open", () => {
          this.setupConnection();
          this.onStatusChange("connected");
          resolve();
        });

        this.connection.on("error", (err) => {
          this.onStatusChange("error");
          reject(err);
        });
      });

      this.peer.on("error", (err) => {
        console.error("PeerJS Error:", err);
        this.onStatusChange("error");
        reject(err);
      });
    });
  }

  private setupConnection() {
    if (!this.connection) return;

    this.connection.on("data", (data: unknown) => {
      const msg = data as PeerMessage;
      if (msg.type === "move") {
        this.onMoveReceived(msg.from, msg.to, msg.promotion);
      }
    });

    this.connection.on("close", () => {
      this.onStatusChange("disconnected");
      this.connection = null;
    });
  }

  public sendMove(from: string, to: string, promotion?: string) {
    if (this.connection && this.connection.open) {
      this.connection.send({
        type: "move",
        from,
        to,
        promotion
      });
    }
  }

  public disconnect() {
    if (this.connection) {
      this.connection.close();
    }
    if (this.peer) {
      this.peer.destroy();
    }
    this.peer = null;
    this.connection = null;
    this.hostId = null;
    this.onStatusChange("disconnected");
  }
}

export const peerService = new PeerService();
