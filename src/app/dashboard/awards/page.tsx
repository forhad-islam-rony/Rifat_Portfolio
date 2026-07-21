"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

export default function AwardsPage() {
  return (
    <CollectionManager
      table="awards"
      title="Awards & Honors"
      description="Scholarships, honors and recognitions."
      addLabel="Add award"
      primary={(r) => r.title}
      secondary={(r) => [r.issuer, r.year].filter(Boolean).join(" · ")}
      fields={[
        { name: "title", label: "Title", colSpan: 2, required: true },
        { name: "issuer", label: "Issuer" },
        { name: "year", label: "Year / Level", placeholder: "e.g. 2023 or HSC" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
    />
  );
}
