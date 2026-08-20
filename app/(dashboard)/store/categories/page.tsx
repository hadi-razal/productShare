"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiPlus, FiTag, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { onAuthChange } from "@/lib/auth";
import {
  getStoreById,
  listProductsByStore,
  reassignProductCategory,
  updateStore,
} from "@/lib/db";
import {
  addCustomCategory,
  asCategoryList,
  categoryKeys,
  categoryLabel,
  mergeProductCategories,
  renameCategory,
} from "@/lib/product-categories";
import {
  isStoreProfileComplete,
  STORE_SETTINGS_PATH,
  storeProfileIncompleteMessage,
} from "@/lib/store-profile";

const TILE_TONES = ["violet", "teal", "amber", "rose", "sky", "lime"] as const;

const toneFor = (value: string) => {
  const hash = Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TILE_TONES[hash % TILE_TONES.length];
};

export default function CategoriesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<{ value: string; label: string } | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ value: string; label: string } | null>(
    null,
  );

  const categories = useMemo(
    () => mergeProductCategories(categoryNames),
    [categoryNames],
  );

  const loadCategories = async (uid: string) => {
    const [store, products] = await Promise.all([
      getStoreById(uid),
      listProductsByStore(uid),
    ]);
    const nextNames = asCategoryList([
      ...(store?.productCategories ?? []),
      ...products.map((product) => product.category),
    ]);
    setCategoryNames(nextNames);
    const complete = isStoreProfileComplete(store);
    setProfileComplete(complete);
    setProfileMessage(complete ? "" : storeProfileIncompleteMessage(store));
    const counts: Record<string, number> = {};
    for (const product of products) {
      const key = String(product.category || "").trim();
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
    setProductCounts(counts);
  };

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
      try {
        await loadCategories(user.uid);
      } catch (error) {
        console.error(error);
        toast.error("Could not load categories.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const requireCompleteProfile = () => {
    if (profileComplete) return true;
    toast.error(profileMessage || storeProfileIncompleteMessage(null));
    router.push(STORE_SETTINGS_PATH);
    return false;
  };

  const persistCategories = async (next: string[]) => {
    if (!userId) return false;
    setSaving(true);
    try {
      await updateStore(userId, { productCategories: next });
      setCategoryNames(next);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Could not save category.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const currentNames = () => categories.map((category) => category.label);

  const handleAddCategory = async () => {
    if (!requireCompleteProfile()) return;
    const next = addCustomCategory(currentNames(), draft);
    if (!draft.trim()) {
      toast.error("Enter a category name.");
      return;
    }
    if (next.length === currentNames().length) {
      toast.error("That category already exists.");
      return;
    }
    const saved = await persistCategories(next);
    if (!saved) return;
    setDraft("");
    setAdding(false);
    toast.success("Category added.");
  };

  const handleEditCategory = async () => {
    if (!editing) return;
    const next = renameCategory(currentNames(), editing.label, editDraft);
    if (!editDraft.trim()) {
      toast.error("Enter a category name.");
      return;
    }
    if (!next) {
      toast.error("That category already exists.");
      return;
    }
    try {
      if (userId) {
        await reassignProductCategory(userId, categoryKeys(editing.value), editDraft.trim());
      }
      const saved = await persistCategories(next);
      if (!saved) return;
      const fromKeys = categoryKeys(editing.value);
      setProductCounts((current) => {
        const moved = fromKeys.reduce((sum, key) => sum + (current[key] || 0), 0);
        const updated = { ...current };
        fromKeys.forEach((key) => {
          delete updated[key];
        });
        if (moved) updated[editDraft.trim()] = (updated[editDraft.trim()] || 0) + moved;
        return updated;
      });
      setEditing(null);
      setEditDraft("");
      toast.success("Category updated.");
    } catch (error) {
      console.error(error);
      toast.error("Could not update category.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirmDelete) return;
    const keys = new Set(categoryKeys(confirmDelete.value).map((item) => item.toLowerCase()));
    const next = currentNames().filter((name) => !keys.has(name.toLowerCase()));
    const saved = await persistCategories(next);
    if (!saved) return;
    setConfirmDelete(null);
    toast.success("Category removed.");
  };

  const countFor = (value: string, label: string) =>
    (productCounts[value] || 0) + (value === label ? 0 : productCounts[label] || 0);

  return (
    <div className="ds-page ds-catalog">
      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <h2 className="ds-catalog-title">Categories</h2>
          <p>
            {loading
              ? "Organize products into categories."
              : `${categories.length} ${categories.length === 1 ? "category" : "categories"} in your catalog.`}
          </p>
        </div>
        <div className="ds-catalog-actions">
          <button
            type="button"
            className="ds-catalog-btn-primary"
            onClick={() => {
              if (!requireCompleteProfile()) return;
              setAdding(true);
            }}
          >
            <FiPlus /> Add new category
          </button>
        </div>
      </div>

      <section>
        <h3 className="ds-category-section-title">All categories</h3>
        <div className="ds-category-grid">
          {loading
            ? [0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="ds-category-tile ds-category-skeleton" />
              ))
            : categories.map((category) => {
                const count = countFor(category.value, category.label);
                return (
                  <article
                    key={category.value}
                    className="ds-category-tile"
                    data-tone={toneFor(category.value)}
                  >
                    <div className="ds-category-tile-top">
                      <span className="ds-category-icon" aria-hidden="true">
                        <FiTag />
                      </span>
                      <div className="ds-category-tile-actions">
                        <button
                          type="button"
                          className="ds-category-action"
                          onClick={() => {
                            setEditing(category);
                            setEditDraft(category.label);
                          }}
                          aria-label={`Edit ${category.label}`}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          className="ds-category-action is-danger"
                          onClick={() => setConfirmDelete(category)}
                          aria-label={`Delete ${category.label}`}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <Link
                      href={`/store/products?category=${encodeURIComponent(category.value)}`}
                      className="ds-category-tile-body"
                    >
                      <strong>{category.label}</strong>
                      <span>
                        {count} {count === 1 ? "product" : "products"}
                      </span>
                    </Link>
                  </article>
                );
              })}
          {!loading && (
            <button
              type="button"
              className="ds-category-tile ds-category-tile-add"
              onClick={() => {
                if (!requireCompleteProfile()) return;
                setAdding(true);
              }}
            >
              <span className="ds-category-icon" aria-hidden="true">
                <FiPlus />
              </span>
              <strong>Add new category</strong>
              <span>Create a custom category</span>
            </button>
          )}
        </div>
      </section>

      {adding && (
        <div className="ds-catalog-modal" onClick={() => !saving && setAdding(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Add new category</strong>
            <p>This category will be available when you add or edit products.</p>
            <input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleAddCategory();
                }
              }}
              placeholder="e.g. Snacks, Jewellery"
              maxLength={40}
              className="ds-category-input"
              disabled={saving}
            />
            <div>
              <button
                type="button"
                className="ds-catalog-btn"
                onClick={() => setAdding(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ds-catalog-btn-primary"
                onClick={() => void handleAddCategory()}
                disabled={saving || !draft.trim()}
              >
                {saving ? "Adding..." : "Add category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div
          className="ds-catalog-modal"
          onClick={() => {
            if (!saving) {
              setEditing(null);
              setEditDraft("");
            }
          }}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Edit category</strong>
            <p>Products in this category will be updated to the new name.</p>
            <input
              autoFocus
              value={editDraft}
              onChange={(event) => setEditDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleEditCategory();
                }
              }}
              placeholder="Category name"
              maxLength={40}
              className="ds-category-input"
              disabled={saving}
            />
            <div>
              <button
                type="button"
                className="ds-catalog-btn"
                onClick={() => {
                  setEditing(null);
                  setEditDraft("");
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ds-catalog-btn-primary"
                onClick={() => void handleEditCategory()}
                disabled={saving || !editDraft.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="ds-catalog-modal" onClick={() => setConfirmDelete(null)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Delete {confirmDelete.label}?</strong>
            <p>Products in this category will keep their current category name.</p>
            <div>
              <button
                type="button"
                className="ds-catalog-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ds-catalog-btn-danger"
                onClick={() => void handleDeleteCategory()}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
