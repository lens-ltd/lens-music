/**
 * Manages deterministic cross-reference IDs used throughout an ERN message.
 *
 * Prefixes:
 *   R0       — main album release
 *   R1, R2…  — track-level releases
 *   A1, A2…  — SoundRecording resources
 *   I1       — Image resources (cover art)
 *   P1, P2…  — Party references
 */
export class ErnReferenceManager {
  private partyMap = new Map<string, string>();
  private partyCounter = 0;
  private soundRecordingCounter = 0;
  private imageCounter = 0;
  private trackReleaseCounter = 0;

  /** Get or create a party reference for a given entity ID. */
  getOrCreatePartyRef(entityId: string): string {
    const existing = this.partyMap.get(entityId);
    if (existing) return existing;

    this.partyCounter++;
    const ref = `P${this.partyCounter}`;
    this.partyMap.set(entityId, ref);
    return ref;
  }

  /** Get a party reference without creating one (returns undefined if not found). */
  getPartyRef(entityId: string): string | undefined {
    return this.partyMap.get(entityId);
  }

  /** Get all registered party references as [entityId, ref] pairs. */
  getAllPartyRefs(): [string, string][] {
    return Array.from(this.partyMap.entries());
  }

  /** Get the next SoundRecording resource reference (A1, A2…). */
  getNextSoundRecordingRef(): string {
    this.soundRecordingCounter++;
    return `A${this.soundRecordingCounter}`;
  }

  /** Get an Image resource reference (I1, I2…). */
  getNextImageRef(): string {
    this.imageCounter++;
    return `I${this.imageCounter}`;
  }

  /** The album-level release reference is always R0. */
  getAlbumReleaseRef(): string {
    return 'R0';
  }

  /** Get the next track-level release reference (R1, R2…). */
  getNextTrackReleaseRef(): string {
    this.trackReleaseCounter++;
    return `R${this.trackReleaseCounter}`;
  }
}
