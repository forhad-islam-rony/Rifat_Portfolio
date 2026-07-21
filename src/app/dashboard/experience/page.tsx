"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

const categoryOptions = [
  { value: "research", label: "Research" },
  { value: "training", label: "Training" },
  { value: "teaching", label: "Teaching" },
  { value: "activity", label: "Activity" },
];

export default function ExperiencePage() {
  return (
    <CollectionManager
      table="experience"
      title="Experience & Activities"
      description="Research, training, teaching and co-curricular experience."
      addLabel="Add experience"
      primary={(r) => r.role}
      secondary={(r) => r.organization}
      fields={[
        { name: "role", label: "Role / Title", colSpan: 2, required: true },
        { name: "organization", label: "Organization", colSpan: 2, required: true },
        { name: "category", label: "Category", type: "select", options: categoryOptions, defaultValue: "research" },
        { name: "location", label: "Location" },
        { name: "start_date", label: "Start date", placeholder: "e.g. September 2025" },
        { name: "end_date", label: "End date", placeholder: "e.g. Present" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2, hint: "One bullet point per line" },
      ]}
    />
  );
}
