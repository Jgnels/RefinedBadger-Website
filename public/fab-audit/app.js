(() => {
  "use strict";

  const TRACKING_ENDPOINT = "/api/demand-test-events";
  const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign"];
  const MAX_CAMPAIGN_LENGTH = 80;

  function clean(value, max = MAX_CAMPAIGN_LENGTH) {
    return String(value || "").trim().slice(0, max);
  }

  function getSessionId() {
    const key = "rb_fab_audit_session";
    try {
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch {
      return "session-unavailable";
    }
  }

  function getCampaign() {
    const params = new URLSearchParams(window.location.search);
    const campaign = {};

    for (const key of CAMPAIGN_KEYS) {
      const storageKey = `rb_${key}`;
      const incoming = clean(params.get(key));
      try {
        if (incoming) sessionStorage.setItem(storageKey, incoming);
        campaign[key] = incoming || clean(sessionStorage.getItem(storageKey));
      } catch {
        campaign[key] = incoming;
      }
    }

    return campaign;
  }

  function track(eventName) {
    if (!eventName) return;

    const campaign = getCampaign();
    const payload = {
      event: clean(eventName, 64),
      sessionId: clean(getSessionId(), 64),
      path: clean(window.location.pathname, 160),
      source: campaign.utm_source,
      medium: campaign.utm_medium,
      campaign: campaign.utm_campaign
    };

    fetch(TRACKING_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      keepalive: true,
      credentials: "same-origin"
    }).catch(() => {
      // Analytics must never block the offer or reservation path.
    });
  }

  function preserveCampaignOnLinks() {
    const campaign = getCampaign();
    const active = Object.entries(campaign).filter(([, value]) => value);
    if (!active.length) return;

    document.querySelectorAll('a[href^="/fab-audit/"]').forEach((link) => {
      const url = new URL(link.href);
      for (const [key, value] of active) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      }
      link.href = `${url.pathname}${url.search}${url.hash}`;
    });
  }

  function wireTracking() {
    const pageEvent = document.body.dataset.analyticsEvent;
    const requiredQuery = document.body.dataset.analyticsQuery;
    let shouldTrackPage = true;

    if (requiredQuery) {
      const [key, expected] = requiredQuery.split("=", 2);
      shouldTrackPage = Boolean(key && expected) && new URLSearchParams(window.location.search).get(key) === expected;
    }

    if (pageEvent && shouldTrackPage) track(pageEvent);

    document.querySelectorAll("[data-track-event]").forEach((element) => {
      element.addEventListener("click", () => track(element.dataset.trackEvent), { passive: true });
    });
  }

  function wireReservationForm() {
    const form = document.querySelector("[data-reservation-form]");
    if (!form) return;

    const campaign = getCampaign();
    for (const key of CAMPAIGN_KEYS) {
      const field = form.elements.namedItem(key);
      if (field) field.value = campaign[key] || (key === "utm_source" ? "direct" : "");
    }

    const nextField = form.elements.namedItem("_next");
    if (nextField) {
      const nextUrl = new URL(nextField.value);
      for (const key of CAMPAIGN_KEYS) {
        if (campaign[key]) nextUrl.searchParams.set(key, campaign[key]);
      }
      nextField.value = nextUrl.toString();
    }

    const textarea = form.elements.namedItem("problem");
    const counter = form.querySelector("[data-character-count]");
    if (textarea && counter) {
      const updateCount = () => { counter.textContent = String(textarea.value.length); };
      textarea.addEventListener("input", updateCount);
      updateCount();
    }

    form.addEventListener("submit", (event) => {
      const honeypot = form.elements.namedItem("_honey");
      if (honeypot && honeypot.value) {
        event.preventDefault();
        return;
      }

      if (!form.checkValidity()) return;
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = "Sending reservation request…";
      }
    });
  }

  function wireDemo() {
    const frames = [...document.querySelectorAll("[data-demo-frame]")];
    const dots = [...document.querySelectorAll("[data-demo-dot]")];
    const toggle = document.querySelector("[data-demo-toggle]");
    const progress = document.querySelector("[data-demo-progress]");
    if (!frames.length || !toggle) return;

    let index = 0;
    let timer = null;
    let startedAt = 0;
    let remaining = Number(frames[0].dataset.duration || 8000);
    let running = false;

    function show(nextIndex) {
      index = (nextIndex + frames.length) % frames.length;
      frames.forEach((frame, frameIndex) => frame.classList.toggle("is-active", frameIndex === index));
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
      remaining = Number(frames[index].dataset.duration || 9000);
      if (progress) {
        progress.style.transition = "none";
        progress.style.width = "0%";
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (running) {
            progress.style.transition = `width ${remaining}ms linear`;
            progress.style.width = "100%";
          }
        }));
      }
    }

    function schedule() {
      clearTimeout(timer);
      startedAt = Date.now();
      timer = setTimeout(() => {
        if (index === frames.length - 1) {
          pause();
          toggle.textContent = "Replay 45-second demo";
          return;
        }
        show(index + 1);
        schedule();
      }, remaining);
    }

    function play() {
      if (index === frames.length - 1) show(0);
      running = true;
      toggle.textContent = "Pause demo";
      show(index);
      schedule();
    }

    function pause() {
      if (!running) return;
      running = false;
      remaining = Math.max(250, remaining - (Date.now() - startedAt));
      clearTimeout(timer);
      if (progress) {
        const width = getComputedStyle(progress).width;
        progress.style.transition = "none";
        progress.style.width = width;
      }
      toggle.textContent = "Continue demo";
    }

    toggle.addEventListener("click", () => running ? pause() : play());
    dots.forEach((dot) => dot.addEventListener("click", () => {
      const wasRunning = running;
      clearTimeout(timer);
      show(Number(dot.dataset.demoDot));
      if (wasRunning) schedule();
    }));

    show(0);
  }

  preserveCampaignOnLinks();
  wireTracking();
  wireReservationForm();
  wireDemo();
})();
