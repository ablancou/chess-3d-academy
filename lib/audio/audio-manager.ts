import { Howl, Howler } from "howler";

// We define a simple audio manager that handles spatial 3D audio.
class AudioManager {
  private sounds: Record<string, Howl> = {};
  private ambientSound: Howl | null = null;
  private enabled: boolean = true;

  constructor() {
    // Basic setup for 3D spatial audio
    Howler.pos(0, 0, 0); // Listener is at the center (0,0,0)

    this.sounds = {
      move: new Howl({
        src: ["https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3"],
        volume: 0.8,
      }),
      capture: new Howl({
        src: ["https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3"],
        volume: 0.8,
      }),
      check: new Howl({
        src: ["https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3"],
        volume: 1.0,
      }),
      castle: new Howl({
        src: ["https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/castle.mp3"],
        volume: 0.8,
      }),
      gameEnd: new Howl({
        src: ["https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3"],
        volume: 1.0,
      })
    };
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      Howler.mute(true);
    } else {
      Howler.mute(false);
    }
  }

  // Play a sound with an optional 3D position based on the board coordinates.
  // We map the board [-4, 4] to audio space.
  public play(type: "move" | "capture" | "check" | "castle" | "gameEnd", position?: [number, number, number]) {
    if (!this.enabled) return;
    
    const sound = this.sounds[type];
    if (sound) {
      const id = sound.play();
      if (position) {
        // Position the sound in 3D space
        // x is left/right, y is up/down, z is front/back
        sound.pos(position[0], position[1], position[2], id);
      }
    }
  }

  public setAmbient(themeId: string) {
    if (!this.enabled) return;

    if (this.ambientSound) {
      this.ambientSound.fade(0.3, 0, 1000);
      setTimeout(() => {
        if (this.ambientSound) {
          this.ambientSound.stop();
          this.ambientSound = null;
        }
      }, 1000);
    }

    let ambientUrl = null;
    
    if (themeId === "mexico-beach" || themeId === "italy-beach") {
      // Free ocean wave sound
      ambientUrl = "https://cdn.freesound.org/previews/404/404329_5121236-lq.mp3"; 
    } else if (themeId === "cyber") {
      // Sci-fi hum
      ambientUrl = "https://cdn.freesound.org/previews/628/628620_11861866-lq.mp3";
    }

    if (ambientUrl) {
      this.ambientSound = new Howl({
        src: [ambientUrl],
        loop: true,
        volume: 0, 
      });
      this.ambientSound.play();
      this.ambientSound.fade(0, 0.2, 2000); // Fade in
    }
  }
}

export const audioManager = new AudioManager();
