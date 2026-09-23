"use client";

import Image from "next/image";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { uploadPublicFile } from "@/lib/storage";
import type { StoreHeader } from "@/lib/store-header";

export default function StoreBannerEditor({ userId, header, onChange, onBusyChange, disabled }: {
  userId: string | null; header: StoreHeader; onChange: Dispatch<SetStateAction<StoreHeader>>;
  onBusyChange: (busy: boolean) => void; disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const upload = async (file: File | undefined, replace?: number) => {
    if (!file || !userId || lock.current) return;
    if (replace === undefined && header.banners.length >= 3) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("Choose a JPG, PNG, or WebP image under 5 MB."); return;
    }
    lock.current = true; setBusy(true); onBusyChange(true);
    try {
      const bitmap = await createImageBitmap(file);
      bitmap.close();
      const url = await uploadPublicFile(`images/banner_${userId}_${crypto.randomUUID()}.${file.type.split("/")[1]}`, file);
      onChange(current => {
        const banners = [...current.banners];
        if (replace !== undefined) banners[replace] = { url, alt: banners[replace]?.alt || "" };
        else if (banners.length < 3) banners.push({ url, alt: "" });
        return { ...current, banners };
      });
      toast.success("Banner uploaded. Save changes to publish it.");
    } catch {
      toast.error("Could not upload this image. Please try again.");
    } finally { lock.current = false; setBusy(false); onBusyChange(false); }
  };
  return <fieldset disabled={disabled || busy || !userId} className="ds-form-group">
    <legend className="ds-form-label">Banner slider · {header.banners.length}/3</legend>
    <label className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={header.autoSlide} onChange={event => onChange(current => ({ ...current, autoSlide: event.target.checked }))} /> Automatically slide banners</label>
    <label className="ds-form-label" htmlFor="banner-delay">Time between banners</label>
    <select id="banner-delay" className="ds-form-input mb-4" disabled={!header.autoSlide || disabled || busy || !userId} value={header.slideDelay} onChange={event => onChange(current => ({ ...current, slideDelay: Number(event.target.value) }))}>
      {Array.from({ length: 30 }, (_, i) => i + 1).map(seconds => <option key={seconds} value={seconds}>{seconds} {seconds === 1 ? "second" : "seconds"}{seconds === 3 ? " (default)" : ""}</option>)}
    </select>
    <p className="ds-form-hint mb-4">Upload up to 3 banners for offers or updates. Recommended: 1600 × 600 px. JPG, PNG or WebP, up to 5 MB each. Save changes to publish.</p>
    <div className="space-y-4">{header.banners.map((banner, index) => <div key={`${banner.url}-${index}`} className="rounded-lg border border-[color:var(--ds-border)] p-3">
      <div className="relative mb-3 aspect-[8/3] overflow-hidden rounded-md bg-[color:var(--ds-canvas)]"><Image src={banner.url} alt={banner.alt || `Banner ${index + 1}`} fill unoptimized style={{ objectFit: "contain" }} /></div>
      <label className="ds-form-label" htmlFor={`banner-alt-${index}`}>Banner {index + 1} description</label>
      <input id={`banner-alt-${index}`} className="ds-form-input" value={banner.alt} maxLength={160} placeholder="Describe the offer for screen readers" onChange={e => onChange(current => ({ ...current, banners: current.banners.map((item, i) => i === index ? { ...item, alt: e.target.value } : item) }))} />
      <div className="my-3 flex flex-wrap gap-3 text-sm">
        <button type="button" disabled={index === 0 || disabled || busy} onClick={() => onChange(current => { const banners = [...current.banners]; [banners[index - 1], banners[index]] = [banners[index], banners[index - 1]]; return { ...current, banners }; })}>Move earlier</button>
        <button type="button" onClick={() => onChange(current => ({ ...current, banners: current.banners.filter((_, i) => i !== index) }))}>Remove</button>
      </div>
      <label className="ds-form-label" htmlFor={`banner-replace-${index}`}>Replace banner</label>
      <input id={`banner-replace-${index}`} type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" onChange={e => { void upload(e.target.files?.[0], index); e.target.value = ""; }} />
    </div>)}</div>
    {header.banners.length < 3 && <div className="mt-4 rounded-lg border border-dashed border-[color:var(--ds-border)] p-4"><label className="ds-form-label" htmlFor="banner-upload">Add banner</label><input id="banner-upload" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></div>}
    {busy && <p className="ds-form-hint" role="status">Uploading banner…</p>}
  </fieldset>;
}
