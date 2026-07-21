"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

export default function PeerReviewsPage() {
  return (
    <CollectionManager
      table="peer_reviews"
      title="Peer Reviews"
      description="Journals you have reviewed for — shown as a highlight on the site."
      addLabel="Add peer review"
      primary={(r) => r.journal}
      secondary={(r) => [r.publisher, r.period].filter(Boolean).join(" · ")}
      fields={[
        { name: "journal", label: "Journal", colSpan: 2, required: true },
        { name: "publisher", label: "Publisher", placeholder: "e.g. Elsevier" },
        { name: "reviews", label: "Number of reviews", type: "number", defaultValue: 1 },
        { name: "period", label: "Period", placeholder: "e.g. June 2026" },
        { name: "url", label: "Certificate URL", colSpan: 2 },
      ]}
    />
  );
}
