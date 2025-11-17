import * as React from "react";

type Offer = {
  matchId: string;
  participants: string[];
  score: { total: number };
};

type AcceptanceOfferProps = {
  offer: Offer;
  onAccept: () => void;
  onDecline: () => void;
  busy?: boolean;
};

const buttonBase =
  "px-3 py-1.5 rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light transition";

export const AcceptanceOffer: React.FC<AcceptanceOfferProps> = ({
  offer,
  onAccept,
  onDecline,
  busy = false,
}) => {
  return (
    <div className="rounded-2xl border border-[color:var(--color-text-secondary)]/10 bg-white p-4 shadow-sm">
      <div className="text-sm text-[color:var(--color-text-secondary)]">
        Match ID: {offer.matchId}
      </div>
      <div className="mt-1 text-base font-semibold text-[color:var(--color-text-primary)]">
        Offer score: {(offer.score.total * 100).toFixed(0)}%
      </div>
      <div className="mt-3 flex gap-6">
        <button
          type="button"
          className={`${buttonBase} bg-primary-main text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60`}
          onClick={onAccept}
          disabled={busy}
        >
          {busy ? "Accepting…" : "Accept"}
        </button>
        <button
          type="button"
          className={`${buttonBase} bg-background-light text-text-primary hover:bg-surface-gray`}
          onClick={onDecline}
          disabled={busy}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export type { Offer };
