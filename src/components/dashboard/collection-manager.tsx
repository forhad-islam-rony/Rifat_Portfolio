"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { api } from "@/lib/api-client";
import {
  PageHeader,
  Modal,
  Field,
  TextInput,
  TextArea,
  Select,
  SaveButton,
  EmptyState,
  Spinner,
} from "./ui";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "tags" | "checkbox" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  colSpan?: 1 | 2;
  required?: boolean;
  defaultValue?: any;
};

type Row = Record<string, any> & { id?: string };

export function CollectionManager({
  table,
  title,
  description,
  fields,
  primary,
  secondary,
  addLabel = "Add item",
}: {
  table: string;
  title: string;
  description?: string;
  fields: FieldSpec[];
  primary: (row: Row) => string;
  secondary?: (row: Row) => string;
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { items } = await api<{ items: Row[] }>(`/api/admin/${table}`);
      setRows(items);
    } catch (err: any) {
      setLoadError(err?.message || "Could not load items.");
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    const blank: Row = {};
    fields.forEach((f) => {
      blank[f.name] =
        f.defaultValue ??
        (f.type === "tags" ? "" : f.type === "checkbox" ? false : f.type === "number" ? 0 : "");
    });
    blank.sort_order = rows.length + 1;
    setForm(blank);
    setEditing(null);
    setError("");
    setModalOpen(true);
  }

  function openEdit(row: Row) {
    const filled: Row = { ...row };
    fields.forEach((f) => {
      if (f.type === "tags" && Array.isArray(row[f.name])) {
        filled[f.name] = row[f.name].join(", ");
      }
    });
    setForm(filled);
    setEditing(row);
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: Row = { ...form };
    fields.forEach((f) => {
      if (f.type === "tags") {
        payload[f.name] = String(form[f.name] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === "number") payload[f.name] = Number(form[f.name] || 0);
      if (f.type === "checkbox") payload[f.name] = Boolean(form[f.name]);
    });

    try {
      const { id: _id, created_at, updated_at, ...body } = payload;
      if (editing?.id) {
        await api(`/api/admin/${table}/${editing.id}`, { method: "PATCH", json: body });
      } else {
        await api(`/api/admin/${table}`, { method: "POST", json: body });
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      setError(err?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!row.id) return;
    if (!confirm(`Delete "${primary(row)}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/${table}/${row.id}`, { method: "DELETE" });
    } catch (err: any) {
      alert(err?.message || "Could not delete.");
    }
    await load();
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="h-4 w-4" /> {addLabel}
          </button>
        }
      />

      {loading ? (
        <Spinner />
      ) : loadError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {loadError}
        </p>
      ) : rows.length === 0 ? (
        <EmptyState message="Nothing here yet. Click “Add” to create your first entry." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-graphite-800/70 p-4 transition-colors hover:border-amber-500/40"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-fg-dim" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-fg">{primary(row)}</p>
                {secondary && (
                  <p className="truncate text-sm text-fg-muted">{secondary(row)}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(row)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-graphite-700 hover:text-amber-400"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(row)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title}` : addLabel}
        wide
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={f.colSpan === 2 ? "sm:col-span-2" : ""}
              >
                <FieldControl
                  spec={f}
                  value={form[f.name]}
                  onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                />
              </div>
            ))}
            <div>
              <Field label="Display order" hint="Lower numbers appear first">
                <TextInput
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, sort_order: Number(e.target.value) }))
                  }
                />
              </Field>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <SaveButton loading={saving} />
          </div>
        </form>
      </Modal>
    </>
  );
}

function FieldControl({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: any;
  onChange: (v: any) => void;
}) {
  if (spec.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line-strong bg-graphite-900 px-3.5 py-2.5">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-line-strong bg-graphite-800 text-amber-500 focus:ring-amber-500"
        />
        <span className="text-sm font-medium text-fg">{spec.label}</span>
      </label>
    );
  }

  return (
    <Field label={spec.label} hint={spec.hint}>
      {spec.type === "textarea" ? (
        <TextArea
          rows={4}
          required={spec.required}
          placeholder={spec.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : spec.type === "select" ? (
        <Select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {spec.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : (
        <TextInput
          type={spec.type === "number" ? "number" : "text"}
          required={spec.required}
          placeholder={spec.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}
