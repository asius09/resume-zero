"use client";

import React from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import type { Contact, ResumeBlock } from "@resume/types";

interface HeaderEditorProps {
  data: any; // Header data
  onUpdate: (newData: any) => void;
}

export function HeaderEditor({ data, onUpdate }: HeaderEditorProps) {
  const updateContacts = (type: string, value: string) => {
    const newContacts = [...(data.contacts || [])];
    const idx = newContacts.findIndex((c: Contact) =>
      type === "social"
        ? ["linkedin", "github", "website", "other"].includes(c.type)
        : c.type === type,
    );

    if (idx > -1) {
      newContacts[idx].value = value;
    } else {
      newContacts.push({
        type: type === "social" ? "linkedin" : type,
        value: value,
      });
    }

    onUpdate({ ...data, contacts: newContacts });
  };

  return (
    <div className="space-y-6">
      <input
        className="text-2xl font-bold tracking-tight text-zinc-900 border-none p-0 focus:ring-0 w-full placeholder:text-zinc-200"
        value={data.fullName || ""}
        onChange={(e) => onUpdate({ ...data, fullName: e.target.value })}
        placeholder="Full Name"
      />
      <div className={clsx("grid", "grid-cols-1", "md:grid-cols-2", "gap-6")}>
        <div
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "text-zinc-500",
            "focus-within:text-zinc-900",
            "transition-colors",
          )}
        >
          <Mail size={16} />
          <input
            className={clsx(
              "flex-1",
              "text-sm",
              "border-none",
              "p-0",
              "focus:ring-0",
              "placeholder-zinc-200",
            )}
            value={
              data.contacts?.find((c: Contact) => c.type === "email")?.value ||
              ""
            }
            onChange={(e) => updateContacts("email", e.target.value)}
            placeholder="Email Address"
          />
        </div>
        <div
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "text-zinc-500",
            "focus-within:text-zinc-900",
            "transition-colors",
          )}
        >
          <Phone size={16} />
          <input
            className={clsx(
              "flex-1",
              "text-sm",
              "border-none",
              "p-0",
              "focus:ring-0",
              "placeholder-zinc-200",
            )}
            value={
              data.contacts?.find((c: Contact) => c.type === "phone")?.value ||
              ""
            }
            onChange={(e) => updateContacts("phone", e.target.value)}
            placeholder="Phone Number"
          />
        </div>
        <div
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "text-zinc-500",
            "focus-within:text-zinc-900",
            "transition-colors",
          )}
        >
          <MapPin size={16} />
          <input
            className="editor-input editor-input-heading"
            value={data.location || ""}
            onChange={(e) => onUpdate({ ...data, location: e.target.value })}
            placeholder="City, Country"
          />
        </div>
        <div
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "text-zinc-500",
            "focus-within:text-zinc-900",
            "transition-colors",
          )}
        >
          <ExternalLink size={16} />
          <input
            className="editor-input editor-input-heading"
            value={
              data.contacts?.find((c: Contact) =>
                ["linkedin", "github", "website", "other"].includes(c.type),
              )?.value || ""
            }
            onChange={(e) => updateContacts("social", e.target.value)}
            placeholder="LinkedIn / GitHub URL"
          />
        </div>
      </div>
    </div>
  );
}
