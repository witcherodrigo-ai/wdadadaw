"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: "",
    logoUrl: "",
    accentColor: "",
    whatsapp: "",
    supportEmail: "",
    refundPolicy: "",
    terms: "",
    socialLinks: ""
  });

  useEffect(() => {
    const loadSettings = async () => {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      if (data) {
        setForm({
          storeName: data.storeName || "",
          logoUrl: data.logoUrl || "",
          accentColor: data.accentColor || "",
          whatsapp: data.whatsapp || "",
          supportEmail: data.supportEmail || "",
          refundPolicy: data.refundPolicy || "",
          terms: data.terms || "",
          socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks, null, 2) : ""
        });
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Configurações</h1>
      <div className="mt-6 glass-card p-6 space-y-4">
        <Input
          placeholder="Nome da loja"
          value={form.storeName}
          onChange={(event) => setForm({ ...form, storeName: event.target.value })}
        />
        <Input
          placeholder="Logo URL"
          value={form.logoUrl}
          onChange={(event) => setForm({ ...form, logoUrl: event.target.value })}
        />
        <Input
          placeholder="Cor de destaque"
          value={form.accentColor}
          onChange={(event) => setForm({ ...form, accentColor: event.target.value })}
        />
        <Input
          placeholder="WhatsApp suporte"
          value={form.whatsapp}
          onChange={(event) => setForm({ ...form, whatsapp: event.target.value })}
        />
        <Input
          placeholder="E-mail suporte"
          value={form.supportEmail}
          onChange={(event) => setForm({ ...form, supportEmail: event.target.value })}
        />
        <Textarea
          placeholder="Política de reembolso"
          value={form.refundPolicy}
          onChange={(event) => setForm({ ...form, refundPolicy: event.target.value })}
        />
        <Textarea
          placeholder="Termos de uso"
          value={form.terms}
          onChange={(event) => setForm({ ...form, terms: event.target.value })}
        />
        <Textarea
          placeholder="Links sociais (JSON)"
          value={form.socialLinks}
          onChange={(event) =>
            setForm({ ...form, socialLinks: event.target.value })
          }
        />
        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
}
