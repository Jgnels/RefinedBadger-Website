const EVENT_PATH = "/api/demand-test-events";
const ALLOWED_EVENTS = new Set([
  "fab_audit_page_view",
  "fab_audit_cta_click",
  "fab_audit_reservation_complete"
]);

function safeText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function plainResponse(status, message, extraHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== EVENT_PATH) {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return plainResponse(405, "Method not allowed", { allow: "POST" });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 4096) {
      return plainResponse(413, "Payload too large");
    }

    let payload;
    try {
      const raw = await request.text();
      if (raw.length > 4096) return plainResponse(413, "Payload too large");
      payload = JSON.parse(raw);
    } catch {
      return plainResponse(400, "Invalid JSON");
    }

    const event = safeText(payload.event, 64);
    if (!ALLOWED_EVENTS.has(event)) {
      return plainResponse(422, "Unknown event");
    }

    const path = safeText(payload.path, 160);
    if (!path.startsWith("/fab-audit")) {
      return plainResponse(422, "Invalid path");
    }

    // Deliberately excludes name, email, form contents, IP address, and user agent.
    console.log({
      type: "refinedbadger_demand_test_event",
      offer: "fab_unreal_capability_audit_beta",
      event,
      session_id: safeText(payload.sessionId, 64),
      path,
      source: safeText(payload.source, 80),
      medium: safeText(payload.medium, 80),
      campaign: safeText(payload.campaign, 80),
      recorded_at: new Date().toISOString()
    });

    return new Response(null, {
      status: 204,
      headers: {
        "cache-control": "no-store",
        "referrer-policy": "no-referrer"
      }
    });
  }
};
