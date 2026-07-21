"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

export default function CertificationsPage() {
  return (
    <CollectionManager
      table="certifications"
      title="Certifications & Presentations"
      description="Courses, training, conference presentations and recognitions."
      addLabel="Add certification"
      primary={(r) => r.title}
      secondary={(r) => [r.issuer, r.date].filter(Boolean).join(" · ")}
      fields={[
        { name: "title", label: "Title", colSpan: 2, required: true },
        { name: "issuer", label: "Issuer / Organizer", colSpan: 2 },
        { name: "date", label: "Date", placeholder: "e.g. January 2026" },
        {
          name: "category",
          label: "Category",
          type: "select",
          defaultValue: "course",
          options: [
            { value: "conference", label: "Conference" },
            { value: "course", label: "Course" },
            { value: "training", label: "Training" },
            { value: "recognition", label: "Recognition" },
          ],
        },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "url", label: "Credential URL", colSpan: 2 },
      ]}
    />
  );
}
