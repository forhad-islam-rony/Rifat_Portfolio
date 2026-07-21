"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

const iconOptions = [
  "atom", "sun", "cpu", "flask-conical", "zap", "leaf", "beaker", "microscope", "sparkles",
].map((v) => ({ value: v, label: v }));

export default function ResearchAreasPage() {
  return (
    <CollectionManager
      table="research_areas"
      title="Research Areas"
      description="The focus areas shown on your home and research pages."
      addLabel="Add research area"
      primary={(r) => r.title}
      secondary={(r) => r.description}
      fields={[
        { name: "title", label: "Title", colSpan: 2, required: true },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "icon", label: "Icon", type: "select", options: iconOptions, defaultValue: "atom", hint: "Choose an icon that fits the area" },
      ]}
    />
  );
}
