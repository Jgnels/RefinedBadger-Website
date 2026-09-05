# RefinedBadger Fab / Unreal Capability Audit — beta launch package

## Offer boundary

- Paid beta price: **$99**.
- Initial capacity: **3 customers maximum**.
- This is a bounded, human-reviewed audit. It is not SaaS, a persistent catalog, or fulfillment infrastructure.
- Customers provide metadata/library information only. Do not request purchased asset source files, project files, credentials, license keys, or proprietary third-party bytes.
- Findings must distinguish evidence, inference, recommendation, and unknowns.
- Do not promise visual compatibility unless it has been directly tested.

## Reservation behavior

The production form posts to FormSubmit for `hello@refinedbadger.com` and redirects successful submissions to `/fab-audit/thanks/?reservation=complete`.

No payment is taken by the form. Accepted customers receive a scope and delivery-date confirmation before the $99 payment is requested.

### External activation required before launch

1. Verify that `hello@refinedbadger.com` reliably forwards to the founder-controlled inbox.
2. Submit one production test reservation.
3. Open the FormSubmit activation email delivered to `hello@refinedbadger.com` and approve the form.
4. Submit a second test reservation and confirm the full field set arrives.
5. Delete the test messages or label them clearly as tests.

Do not announce the offer until both test submissions succeed end to end.

## Analytics events

The landing-page script sends three non-PII events to `/api/demand-test-events`:

| Event | Trigger |
| --- | --- |
| `fab_audit_page_view` | `/fab-audit/` loads |
| `fab_audit_cta_click` | A paid-beta reservation CTA is clicked |
| `fab_audit_reservation_complete` | The FormSubmit success redirect loads `/fab-audit/thanks/?reservation=complete` |

The Worker logs only event name, random session ID, page path, optional UTM source/medium/campaign, and server timestamp. The completion event is gated by the success-only `reservation=complete` redirect marker so a direct visit to the thank-you URL is not counted. It does not log reservation fields, email, name, IP address, or user agent in the custom event object.

Cloudflare Workers Logs must remain enabled. For the beta, review/filter logs for `refinedbadger_demand_test_event` and capture counts before log retention expires.

## 45-second demo storyboard and voiceover

The executable visual storyboard is at `/fab-audit/demo/`.

**00:00–00:08 — Before**  
“We reached the point where owning more Unreal assets made our decisions worse. We had roughly 630 current Fab products plus hundreds of other local assets, but no coherent picture of what capability we actually owned.”

**00:08–00:17 — Normalize**  
“We normalized the estate into 831 logical catalog records so we could reason about owned capability instead of storefront rows and memory.”

**00:17–00:26 — Map**  
“That surfaced 211 environment-capable profiles, overlapping systems, coherent families, and professional alternatives that challenged custom work we were considering.”

**00:26–00:35 — Bound the claim**  
“Hivemind emerged as a promising modular environment family. That was an inference, not proof of visual or technical compatibility, so the unknowns became explicit test criteria.”

**00:35–00:45 — Act**  
“The useful output was one bounded prototype, evidence requirements, stop conditions, and an execution-grade AI prompt—before another purchase or custom system. That is the outcome this $99 beta is testing with three developers.”

## Launch post variants — founder approval required

### Variant 1 — founder story

I hit the point where owning more Unreal assets made me less certain about what I could actually build.

RefinedBadger had roughly 630 current Fab products plus hundreds of other local assets. Once we mapped them as capabilities instead of store listings, we found overlapping systems, underused environment families, and professional alternatives to work we were considering building ourselves.

I’m testing a small paid service for other Unreal developers with the same problem: a bounded Fab / Unreal Capability Audit. It maps what you already have, where it overlaps, what looks unusually useful, the real gaps, and one next empirical test with an execution-grade AI prompt.

The beta is $99 and capped at 3 customers. You provide metadata/library information—not purchased asset files or account credentials.

https://refinedbadger.com/fab-audit/

### Variant 2 — problem-led

For Unreal developers with large Fab or Marketplace libraries: can you clearly answer what capability you already own?

Not which products are in the library—what systems, environment families, substitutions, overlaps, and prototype options are actually available to you.

I could not answer that for RefinedBadger’s own 600+ Fab-asset problem, so I built the audit for us first. I’m now testing three paid beta slots at $99 each.

The output is deliberately bounded: capability inventory, overlap findings, underused strengths, owned alternatives to generic custom systems, 3–5 prototype opportunities, actual gaps, one recommended test, and one execution-grade AI prompt.

Metadata only. No purchased source files. No compatibility claims without evidence.

https://refinedbadger.com/fab-audit/

### Variant 3 — concrete internal result

A recent RefinedBadger asset review turned roughly 630 current Fab products into 831 logical catalog records and surfaced 211 environment-capable profiles.

The useful part was not organization. It was discovering where owned systems overlapped, where a family such as Hivemind looked promising enough to test, and where professional assets we already owned should challenge custom-development plans.

I’m offering the same bounded outcome to 3 Unreal developers as a $99 paid beta: tell me what I already have, what overlaps, what is unusually valuable, what I should test next, and what gap is actually still real.

This is a manual audit based on metadata/library information. It is not SaaS, does not require purchased asset source files, and does not promise visual compatibility without direct evidence.

https://refinedbadger.com/fab-audit/

## Publication checklist

1. Review the landing page, form, thank-you page, demo, and all copy.
2. Confirm `hello@refinedbadger.com` routing.
3. Activate and retest FormSubmit.
4. Deploy the branch to a non-production preview if desired; inspect desktop and mobile.
5. Merge only after founder approval.
6. Deploy `main` through the existing Cloudflare process.
7. Test the live CTA, analytics endpoint, FormSubmit delivery, and thank-you redirect once.
8. Approve one launch post and publish it manually in a community where self-promotion is allowed.

Stop after the demand test is live. Do not build fulfillment software unless paid demand justifies it.
