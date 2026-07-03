"use client";

import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { indexToSquare, isLightSquare } from "@/lib/chess/coordinates";
import { getEnPassantCaptureSquare } from "@/lib/chess/en-passant";
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
import { EnPassantBurst } from "./effects/EnPassantBurst";
import { MoveImpact } from "./effects/MoveImpact";
import { CapturedPieceEffect } from "./effects/CapturedPieceEffect";

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
  const coachHint = useGameStore((s) => s.coachHint);
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
      <MoveImpact
        lastMove={lastMove}
        color={theme.board.lastMove}
        isCapture={Boolean(lastMove?.captured)}
      />
      <CapturedPieceEffect lastMove={lastMove} moveTimestamp={moveTimestamp} />

      {lastMove?.isCastling && (
        <CastleBurst
          from={lastMove.from}
          to={lastMove.to}
          color={theme.board.gridGlow}
          moveKey={`${lastMove.from}-${lastMove.to}-${moveTimestamp}`}
        />
      )}

      {lastMove?.isEnPassant && (() => {
        const cap = getEnPassantCaptureSquare(lastMove);
        return cap ? (
          <EnPassantBurst
            captureSquare={cap}
            color="#f97316"
            moveKey={`ep-${lastMove.from}-${lastMove.to}-${moveTimestamp}`}
          />
        ) : null;
      })()}

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

      {coachHint && (
        <GuideArrow
          highlight={{
            from: coachHint.from as Square,
            to: coachHint.to as Square,
          }}
          color="#22d3ee"
        />
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