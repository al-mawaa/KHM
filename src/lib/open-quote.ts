/** Dispatches a global event handled by `Navbar` to open the inquiry / quote modal. */
export function openQuoteInquiry(service = "Consultation") {
  window.dispatchEvent(new CustomEvent("khm-open-quote", { detail: { service } }));
}
