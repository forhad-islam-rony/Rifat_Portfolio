"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

export default function PublicationsAdminPage() {
  return (
    <CollectionManager
      table="publications"
      title="Publications"
      description="Add, edit and remove your journal and conference papers."
      addLabel="Add publication"
      primary={(r) => r.title}
      secondary={(r) =>
        [r.venue, r.year, `${r.citations || 0} citations`]
          .filter(Boolean)
          .join(" · ")
      }
      fields={[
        { name: "title", label: "Title", type: "textarea", colSpan: 2, required: true },
        { name: "authors", label: "Authors", type: "textarea", colSpan: 2, required: true, hint: "Your name (Rafiu) is highlighted automatically on the site" },
        { name: "venue", label: "Journal / Venue", colSpan: 2 },
        { name: "year", label: "Year", type: "number", defaultValue: new Date().getFullYear() },
        { name: "volume", label: "Volume / Pages", placeholder: "e.g. 16(9), 7803-7829" },
        {
          name: "type",
          label: "Type",
          type: "select",
          defaultValue: "journal",
          options: [
            { value: "journal", label: "Journal Article" },
            { value: "conference", label: "Conference Paper" },
            { value: "preprint", label: "Preprint" },
            { value: "thesis", label: "Thesis" },
          ],
        },
        { name: "citations", label: "Citations", type: "number", defaultValue: 0 },
        { name: "doi", label: "DOI", placeholder: "10.1039/xxxxx" },
        { name: "url", label: "Link (URL)", colSpan: 2, placeholder: "https://doi.org/…" },
        { name: "tags", label: "Tags", type: "tags", colSpan: 2, hint: "Comma separated, e.g. DFT, Perovskite, Solar Cells" },
        { name: "featured", label: "Feature on home page", type: "checkbox" },
      ]}
    />
  );
}
