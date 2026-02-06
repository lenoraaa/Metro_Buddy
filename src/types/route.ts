/**
 * Strict TypeScript interfaces matching the required JSON structure
 */

export type LineColor = 'Blue' | 'Red' | 'Green' | 'Yellow' | 'Purple';

export interface RouteData {
  line_color: LineColor;
  start_station: string;
  destination_station: string;
  total_stops: number;
  transfer_required: boolean;
  steps: string[]; // Legacy, kept for fallback
  audio_script: string[]; // Legacy
  visual_icons: string[]; // Legacy
  confidence_message: string;
  ai_insight?: string; // New field for visible AI reasoning

  // New Audio-First Structure
  smart_steps: NavigationStep[];
}

export interface NavigationStep {
  id: number;
  type: 'entry' | 'ticket' | 'platform' | 'board' | 'ride' | 'transfer' | 'exit';
  instruction: string; // Short text for display: "Go to Platform 2"
  audio_text: string; // Detailed spoken text: "Head to Platform 2. Look for the Blue pillars."
  visual_cue?: string; // e.g., "Blue Pillars" or "Mall Exit"
  icon: string; // "🚪", "🎟️", "🚆"
  metadata?: {
    platform?: string;
    gate?: string;
    cost?: string;
    ticket_type?: string;
    landmark?: string;
  };
}

export interface StationOption {
  id: string;
  name: string;
  landmark?: string;
  phonetic?: string;
  lines: LineColor[];
}

export interface RouteRequest {
  start_station: string;
  destination_station: string;
}
