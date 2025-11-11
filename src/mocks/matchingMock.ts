export type EnqueueBody = Record<string, unknown>;

export async function enqueueMock(_body: EnqueueBody) {
  void _body;
  await delay(200);
  return {
    request: { requestId: "req_demo", userId: "u_demo" },
    enqueuedAt: new Date().toISOString(),
    priority: 1,
  };
}

export async function offerMock() {
  await delay(300);
  const matchId = "m_demo";
  return {
    matchId,
    participants: ["u_demo", "u_peer"],
    score: { total: 0.82 },
  };
}

export async function channelOpenMock() {
  await delay(300);
  return { channelId: "ch_demo" };
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
