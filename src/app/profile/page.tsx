"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User as UserIcon,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
  Save,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  college?: string;
  city?: string;
  branch?: string;
  year?: string;
  phone?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({
    name: "",
    college: "",
    city: "",
    branch: "",
    year: "",
    phone: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setProfile(data.user);
          setForm({
            name: data.user.name || "",
            college: data.user.college || "",
            city: data.user.city || "",
            branch: data.user.branch || "",
            year: data.user.year || "",
            phone: data.user.phone || "",
          });
        } else {
          toast.error(data.error || "Failed to load profile");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }

      toast.success("Profile updated!");
      setProfile(data.user);
      setEditing(false);
      await update();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      college: profile.college || "",
      city: profile.city || "",
      branch: profile.branch || "",
      year: profile.year || "",
      phone: profile.phone || "",
    });
    setEditing(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="container-page py-20 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-page py-20 text-center">
        <UserIcon className="w-12 h-12 text-ink-mute mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
      </div>
    );
  }

  const userInitial = profile.name?.charAt(0).toUpperCase() || "U";

  return (
    <section className="container-page py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
          <p className="text-ink-soft mt-2">
            Manage your account details
          </p>
        </div>

        <div className="card-base overflow-hidden mb-6">
          <div className="h-28 bg-gradient-to-r from-primary to-primary-hover" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
              <div className="w-24 h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-4xl font-bold border-4 border-surface shadow-card">
                {userInitial}
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-ink-soft flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </p>
              </div>
              <Button
                variant={editing ? "outline" : "default"}
                onClick={() => (editing ? handleCancel() : setEditing(true))}
                className={
                  editing
                    ? ""
                    : "bg-primary hover:bg-primary-hover"
                }
              >
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-base p-4">
            <div className="flex items-center gap-2 text-ink-mute text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Member since
            </div>
            <p className="font-semibold text-sm">
              {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="card-base p-4">
            <div className="flex items-center gap-2 text-ink-mute text-xs mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              College
            </div>
            <p className="font-semibold text-sm truncate">
              {profile.college || "Not set"}
            </p>
          </div>
          <div className="card-base p-4">
            <div className="flex items-center gap-2 text-ink-mute text-xs mb-1">
              <MapPin className="w-3.5 h-3.5" />
              City
            </div>
            <p className="font-semibold text-sm truncate">
              {profile.city || "Not set"}
            </p>
          </div>
        </div>

        <div className="card-base p-6 md:p-8">
          <h3 className="font-semibold mb-6">Account Details</h3>

          {editing ? (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    placeholder="IIT Delhi"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="CSE"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="3rd"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary-hover"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-ink-mute mb-1">Full Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute mb-1">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute mb-1">College</p>
                  <p className="font-medium">{profile.college || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute mb-1">City</p>
                  <p className="font-medium">{profile.city || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute mb-1">Branch</p>
                  <p className="font-medium">{profile.branch || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute mb-1">Year</p>
                  <p className="font-medium">{profile.year || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-mute mb-1">Phone</p>
                  <p className="font-medium">{profile.phone || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}