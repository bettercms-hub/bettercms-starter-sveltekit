<script lang="ts">
  /** Footer newsletter (Ft7). Renders the seeded `Newsletter` form.
   *
   *  Deliberately not the sections' form runtime: this is a one-field inline row (label · input
   *  · button) for the footer, and it owns its own aria-live status copy. It stays off
   *  `data-bcms-form`, so the Contact page's form runtime never adopts it and posts it twice. */
  import type { LayoutData } from "../../routes/$types";

  let { form }: { form: NonNullable<LayoutData["newsletter"]> } = $props();

  let status = $state<{ text: string; ok: boolean } | null>(null);
  let busy = $state(false);

  async function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    const el = e.currentTarget as HTMLFormElement;
    if (!el.reportValidity()) return;
    const data: Record<string, string> = {};
    new FormData(el).forEach((v, k) => {
      data[k] = String(v);
    });
    busy = true;
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error(String(res.status));
      el.reset();
      status = { text: form.successMessage, ok: true };
    } catch {
      status = { text: "Something went wrong. Please try again.", ok: false };
    } finally {
      busy = false;
    }
  }
</script>

<form class="newsletter" method="post" action={form.action} {onsubmit}>
  <label class="newsletter-label" for="newsletter-email">{form.label}</label>
  <div class="newsletter-row">
    <input id="newsletter-email" type="email" name={form.emailKey} required placeholder={form.placeholder} autocomplete="email" />
    <button type="submit" disabled={busy}>{form.submitLabel}</button>
  </div>
  {#if form.honeypotField}
    <input
      type="text"
      name={form.honeypotField}
      tabindex="-1"
      autocomplete="off"
      style="position:absolute;left:-9999px"
      aria-hidden="true"
    />
  {/if}
  <!-- aria-live so the outcome reaches a screen reader — it's the only feedback there is. -->
  <p
    class="newsletter-msg"
    class:newsletter-msg--ok={status?.ok === true}
    class:newsletter-msg--err={status?.ok === false}
    role="status"
    aria-live="polite"
    hidden={!status}
  >
    {status?.text ?? ""}
  </p>
</form>
