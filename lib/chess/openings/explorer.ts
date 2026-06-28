export interface OpeningInfo {
  eco: string;
  name: string;
}

export interface ExplorerMove {
  uci: string;
  san: string;
  white: number;
  draws: number;
  black: number;
  averageRating: number;
}

export interface ExplorerResult {
  opening: OpeningInfo | null;
  moves: ExplorerMove[];
}

export async function fetchOpeningInfo(fen: string): Promise<ExplorerResult | null> {
  try {
    // The Lichess Masters Database API is free and public
    const url = new URL("https://explorer.lichess.ovh/masters");
    url.searchParams.set("fen", fen);
    url.searchParams.set("moves", "3"); // Get top 3 moves
    url.searchParams.set("topGames", "0");
    
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    return {
      opening: data.opening || null,
      moves: data.moves || []
    };
  } catch (error) {
    console.error("Error fetching opening info from Lichess:", error);
    return null;
  }
}
