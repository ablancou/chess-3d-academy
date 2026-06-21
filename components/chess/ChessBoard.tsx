"use client";

import type { Square } from "chess.js";
import { indexToSquare, isLightSquare } from "@/lib/chess/coordinates";
import { getThemeById } from "@/lib/chess/themes";
import { useGameStore } from "@/stores/game-store";
import { useThemeStore } from "@/stores/theme-store";
import { BoardBase } from "./BoardBase";
import { BoardCoordinates } from "./BoardCoordinates";
import { BoardSquare } from "./BoardSquare";
import { ChessPiece } from "./ChessPiece";
import { GuideArrow } from "./GuideArrow";

export function ChessBoard() {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);
  const board = useGameStore((s) => s.board);
  const selectedSquare = useGameStore((s) => s.selectedSquare);
  const legalTargets = useGameStore((s) => s.legalTargets);
  const lastMove = useGameStore((s) => s.lastMove);
  const guideHighlight = useGameStore((s) => s.guideHighlight);
  const guideEnabled = useGameStore((s) => s.guideEnabled);

  const squares: Square[] = [];
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      squares.push(indexToSquare(file, rank));
    }
  }

  return (
    <group>
      <BoardBase theme={theme.board} />
      <BoardCoordinates color={theme.board.gridGlow} />

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