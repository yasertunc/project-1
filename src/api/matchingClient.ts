export type { paths as MatchingPaths } from "../types/matching";

type EnqueueBody =
  import("../types/matching").paths["/v1/match/enqueue"]["post"]["requestBody"]["content"]["application/json"];
type EnqueueResp =
  import("../types/matching").paths["/v1/match/enqueue"]["post"]["responses"]["202"]["content"]["application/json"];
type CancelBody =
  import("../types/matching").paths["/v1/match/cancel"]["post"]["requestBody"]["content"]["application/json"];

export interface MatchingClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  getAuthToken?: () => Promise<string | undefined> | string | undefined;
}

export function createMatchingClient(opts: MatchingClientOptions = {}) {
  const base = (opts.baseUrl ?? "https://staging-api.fellowus.com").replace(
    /\/+$/,
    "",
  );
  const fx = opts.fetchImpl ?? fetch;

  async function headers() {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    const tok = await Promise.resolve(opts.getAuthToken?.());
    if (tok) h.Authorization = `Bearer ${tok}`;
    return h;
  }

  return {
    async enqueue(body: EnqueueBody): Promise<EnqueueResp> {
      const res = await fx(`${base}/v1/match/enqueue`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw await toError(res);
      return res.json();
    },

    async cancel(body: CancelBody): Promise<void> {
      const res = await fx(`${base}/v1/match/cancel`, {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify(body),
      });
      if (!res.ok && res.status !== 204) throw await toError(res);
    },

    async tick(): Promise<{
      matchedCount?: number;
      expandedCount?: number;
      queueDepth?: number;
    }> {
      const res = await fx(`${base}/v1/match/tick`, {
        method: "POST",
        headers: await headers(),
      });
      if (!res.ok) throw await toError(res);
      return res.json();
    },
  };
}

async function toError(res: Response) {
  let message = `${res.status} ${res.statusText}`;
  try {
    const j = await res.json();
    if (j?.message) message = j.message;
  } catch {
    // ignore parse errors
  }
  type HttpError = Error & { status?: number };
  const err: HttpError = new Error(message);
  err.status = res.status;
  return err;
}
