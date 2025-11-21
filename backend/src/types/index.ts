import {
  Intent,
  Language,
  MessageType,
  ReportReason,
  MatchStatus,
} from "../config/constants";

export interface Location {
  geoHash: string;
  radius: number;
}

export interface Capabilities {
  text: boolean;
  voice: boolean;
  location: boolean;
}

export interface Preferences {
  maxWaitTime: number;
  language: Language;
}

export interface MatchRequest {
  intent: Intent;
  location: Location;
  capabilities: Capabilities;
  preferences: Preferences;
}

export interface QueueSlot {
  matchId: string;
  queuePosition: number;
  estimatedWaitTime: number;
}

export interface MatchStatusResponse {
  matchId: string;
  status: MatchStatus;
  queuePosition: number | null;
  matchedAt: string | null;
  participants: Array<{
    handle: string;
    capabilities: Capabilities;
  }> | null;
}

export interface Participant {
  handle: string;
  score: number;
  capabilities: Capabilities;
}

export interface MatchScore {
  total: number;
  intent: number;
  location: number;
  capabilities: number;
}

export interface OfferRequest {
  matchId: string;
  participants: Participant[];
  score: MatchScore;
}

export interface OfferResponse {
  offerId: string;
  expiresAt: string;
}

export interface OfferActionResponse {
  status: "accepted" | "declined";
  channelId: string | null;
}

export interface ChannelResponse {
  channelId: string;
  participants: Array<{
    handle: string;
    capabilities: Capabilities;
  }>;
  expiresAt: string;
}

export interface MessageRequest {
  text: string;
  type: MessageType;
}

export interface Message {
  messageId: string;
  from: string;
  text: string;
  type: MessageType;
  timestamp: string;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

export interface ReportRequest {
  channelId: string;
  reportedHandle: string;
  reason: ReportReason;
  description?: string;
}

export interface ReportResponse {
  reportId: string;
}

export interface CancelRequest {
  matchId: string;
}
