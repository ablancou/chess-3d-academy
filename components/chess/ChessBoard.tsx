"use client";

import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { indexToSquare, isLightSquare } from "@/lib/chess/coordinates";
import { findKingSquare } from "@/lib/chess/move-logic";
import { getThemeById } from "@/lib/chess/themes";
import { useGameStore } from "@/stores/game-store";
import { useThemeStore } from "@/stores/theme-store";
import { BoardBase } from "./BoardBase";
import { BoardCoordinates } from "./BoardCoordinates";
import { BoardSquare } from "./BoardSquare";
import { ChessPiece } from "./ChessPiece";
import { GuideArrow } from "./GuideArrow";
import { BoardAura } from "./effects/BoardAura";
import { CastleBurst } from "./effects/CastleBurst";
import { CheckPulse } from "./effects/CheckPulse";
import { MoveImpact } from "./effects/MoveImpact";

export function ChessBoard() {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);
  const board = useGameStore((s) => s.board);
  const selectedSquare = useGameStore((s) => s.selectedSquare);
  const legalTargets = useGameStore((s) => s.legalTargets);
  const lastMove = useGameStore((s) => s.lastMove);
  const moveTimestamp = useGameStore((s) => s.moveTimestamp);
  const guideHighlight = useGameStore((s) => s.guideHighlight);
  const guideEnabled = useGameStore((s) => s.guideEnabled);
  const status = useGameStore((s) => s.status);
  const turn = useGameStore((s) => s.turn);
  const fen = useGameStore((s) => s.fen);

  const squares: Square[] = [];
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      squares.push(indexToSquare(file, rank));
    }
  }

  let checkedKingSquare: Square | null = null;
  if (status === "check") {
    try {
      const chess = new Chess(fen);
      checkedKingSquare = findKingSquare(chess, turn);
    } catch {
      checkedKingSquare = null;
    }
  }

  return (
    <group>
      <BoardAura color={theme.board.gridGlow} />
      <BoardBase theme={theme.board} />
      <BoardCoordinates color={theme.board.gridGlow} />
      <MoveImpact lastMove={lastMove} color={theme.board.lastMove} />

      {lastMove?.isCastling && (
        <CastleBurst
          from={lastMove.from}
          to={lastMove.to}
          color={theme.board.gridGlow}
          moveKey={`${lastMove.from}-${lastMove.to}-${moveTimestamp}`}
        />
      )}

      {checkedKingSquare && (
        <CheckPulse square={checkedKingSquare} active />
      )}

      {squares.map((square) => {
        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1], 10) - 1;
        return (
          <BoardSquare
            key={square}
            square={square}
            isLight={isLightSquare(file, rank)}
            isSelected={selectedSquare === square}
            isLegalTarget={legalTargets.includes(square)}
            isLastMove={lastMove?.from === square || lastMove?.to === square}
            isGuideTarget={guideEnabled && guideHighlight?.to === square}
            theme={theme.board}
          />
        );
      })}

      {guideEnabled && guideHighlight && (
        <GuideArrow highlight={guideHighlight} color="#fbbf24" />
      )}

      {board.map((piece) => (
        <ChessPiece
          key={`${piece.color}-${piece.type}-${piece.square}`}
          square={piece.square}
          color={piece.color}
          type={piece.type}
          isSelected={selectedSquare === piece.square}
          isGuideFrom={guideEnabled && guideHighlight?.from === piece.square}
          pieceTheme={theme.pieces}
        />
      ))}
    </group>
  );
}