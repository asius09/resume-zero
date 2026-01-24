"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Contact, ResumeBlock } from "@resume/types";

interface HeaderEditorProps {
  data: Extract<ResumeBlock, { type: "header" }>["data"];
  onUpdate: (newData: Extract<ResumeBlock, { type: "header" }>["data"]) => void;
}

export function HeaderEditor({ data, onUpdate }: HeaderEditorProps) {
  const updateContacts = (type: Contact["type"] | "social", value: string) => {
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
        type: (type === "social" ? "linkedin" : type) as Contact["type"],
        value: value,
      });
    }

    onUpdate({ ...data, contacts: newContacts });
  };

  return (
    <Card className="border-zinc-100 shadow-none">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1.5">
          <Label>Full Name</Label>
          <Input
            className="text-lg font-bold"
            value={data.fullName || ""}
            onChange={(e) => onUpdate({ ...data, fullName: e.target.value })}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Email Address</Label>
            <Input
              value={
                data.contacts?.find((c: Contact) => c.type === "email")
                  ?.value || ""
              }
              onChange={(e) => updateContacts("email", e.target.value)}
              placeholder="e.g. john@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone Number</Label>
            <Input
              value={
                data.contacts?.find((c: Contact) => c.type === "phone")
                  ?.value || ""
              }
              onChange={(e) => updateContacts("phone", e.target.value)}
              placeholder="e.g. +1 123 456 7890"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={data.location || ""}
              onChange={(e) => onUpdate({ ...data, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Social / Website</Label>
            <Input
              value={
                data.contacts?.find((c: Contact) =>
                  ["linkedin", "github", "website", "other"].includes(c.type),
                )?.value || ""
              }
              onChange={(e) => updateContacts("social", e.target.value)}
              placeholder="e.g. linkedin.com/in/johndoe"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
