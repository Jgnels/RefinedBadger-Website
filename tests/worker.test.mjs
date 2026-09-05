import assert from "node:assert/strict";
import worker from "../src/worker.mjs";

const logs = [];
const originalLog = console.log;
console.log = (value) => logs.push(value);

const env = {
  ASSETS: {
    fetch: async () => new Response("asset", { status: 200 })
  }
};

try {
  const valid = await worker.fetch(new Request("https://refinedbadger.com/api/demand-test-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "fab_audit_cta_click",
      sessionId: "test-session",
      path: "/fab-audit/",
      source: "test",
      medium: "local",
      campaign: "beta"
    })
  }), env);
  assert.equal(valid.status, 204);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].event, "fab_audit_cta_click");
  assert.equal("email" in logs[0], false);

  const invalidEvent = await worker.fetch(new Request("https://refinedbadger.com/api/demand-test-events", {
    method: "POST",
    body: JSON.stringify({ event: "made_up", path: "/fab-audit/" })
  }), env);
  assert.equal(invalidEvent.status, 422);

  const invalidPath = await worker.fetch(new Request("https://refinedbadger.com/api/demand-test-events", {
    method: "POST",
    body: JSON.stringify({ event: "fab_audit_page_view", path: "/private" })
  }), env);
  assert.equal(invalidPath.status, 422);

  const wrongMethod = await worker.fetch(new Request("https://refinedbadger.com/api/demand-test-events"), env);
  assert.equal(wrongMethod.status, 405);

  const fallback = await worker.fetch(new Request("https://refinedbadger.com/fab-audit/"), env);
  assert.equal(fallback.status, 200);
  assert.equal(await fallback.text(), "asset");

  process.stdout.write("worker tests passed\n");
} finally {
  console.log = originalLog;
}
