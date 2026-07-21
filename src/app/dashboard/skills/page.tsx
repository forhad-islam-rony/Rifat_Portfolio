"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

export default function SkillsPage() {
  return (
    <CollectionManager
      table="skills"
      title="Technical Skills"
      description="Grouped skills shown on the About page."
      addLabel="Add skill group"
      primary={(r) => r.category}
      secondary={(r) => (Array.isArray(r.items) ? r.items.join(", ") : "")}
      fields={[
        { name: "category", label: "Category", colSpan: 2, required: true, placeholder: "e.g. Simulation Software" },
        { name: "items", label: "Skills", type: "tags", colSpan: 2, hint: "Separate each skill with a comma", placeholder: "CASTEP, VESTA, SCAPS-1D" },
      ]}
    />
  );
}
