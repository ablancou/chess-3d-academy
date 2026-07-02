"use client";

import { useEffect, useState } from "react";
import { Link2, Users, Loader2, Copy, CheckCircle2, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/game-store";
import { peerService, type PeerStatus } from "@/lib/multiplayer/peer-service";
import { Input } from "@/components/ui/input";

export function MultiplayerPanel() {
  const [status, setStatus] = useState<PeerStatus>("disconnected");
  const [hostId, setHostId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [joinId, setJoinId] = useState("");
  
  const mode = useGameStore((s) => s.mode);
  const applyPeerMove = useGameStore((s) => s.applyPeerMove);

  useEffect(() => {
    peerService.onStatusChange = (newStatus) => {
      setStatus(newStatus);
      if (newStatus === "hosting" && peerService.hostId) {
        setHostId(peerService.hostId);
      }
    };

    peerService.onMoveReceived = (from, to, promotion) => {
      applyPeerMove(
        from as Parameters<typeof applyPeerMove>[0],
        to as Parameters<typeof applyPeerMove>[1],
        promotion as Parameters<typeof applyPeerMove>[2],
      );
    };

    // Auto-join if URL has ?host=id
    const searchParams = new URLSearchParams(window.location.search);
    const hostParam = searchParams.get("host");
    if (hostParam && status === "disconnected") {
      peerService.joinGame(hostParam);
    }

    return () => {
      peerService.onStatusChange = () => {};
      peerService.onMoveReceived = () => {};
    };
  }, [applyPeerMove, status]);

  if (mode !== "play") return null;

  const handleHost = async () => {
    try {
      await peerService.hostGame();
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoin = async () => {
    if (!joinId.trim()) return;
    try {
      await peerService.joinGame(joinId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("host", hostId);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    peerService.disconnect();
  };

  return (
    <Card className="border-indigo-500/20 bg-indigo-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="size-4 text-indigo-400" />
          Multijugador Online (P2P)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "disconnected" && (
          <div className="space-y-4">
            <Button onClick={handleHost} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link2 className="size-4 mr-2" />
              Crear Partida (Host)
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#080d1a] px-2 text-zinc-500">o unirse</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="ID de la partida..."
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
              />
              <Button onClick={handleJoin} variant="outline" className="shrink-0 border-white/10 hover:bg-white/5">
                <UserPlus className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {status === "connecting" && (
          <div className="flex flex-col items-center justify-center py-4 space-y-2 text-indigo-300">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-sm">Conectando...</span>
          </div>
        )}

        {status === "hosting" && (
          <div className="space-y-3">
            <div className="text-sm text-center text-zinc-300">
              Esperando a un oponente...
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-zinc-400 truncate select-all">
                {hostId}
              </div>
              <Button onClick={handleCopyLink} variant="outline" size="icon" className="shrink-0 border-white/10">
                {copied ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <Button onClick={handleDisconnect} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 text-xs">
              Cancelar
            </Button>
          </div>
        )}

        {status === "connected" && (
          <div className="flex flex-col items-center py-2 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20">
              <CheckCircle2 className="size-4" />
              Conectado al Oponente
            </div>
            <Button onClick={handleDisconnect} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 text-xs">
              Desconectar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
