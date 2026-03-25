import { useState, useEffect } from "react";
import { User, Shield, Bell, Globe, CreditCard, Save, Edit2, Check, Smartphone, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

export function Settings() {
  const [activeTab, setActiveTab] = useState("Profile Settings");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    bio: ""
  });

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: session.user.email || "",
          bio: data.bio || ""
        });
      } else {
        setProfile(prev => ({ ...prev, email: session.user.email || "" }));
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: profile.full_name,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
      }
    }
    setIsSaving(false);
  };

  const tabs = [
    { name: "Profile Settings", icon: User },
    { name: "Security & Passwords", icon: Shield },
    { name: "Notifications", icon: Bell },
    { name: "Payment Gateways", icon: CreditCard },
    { name: "Localization", icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Admin Settings
          </h1>
          <p className="text-on-surface-variant mt-1">
            Configure your dashboard preferences and system settings.
          </p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === tab.name
                  ? "bg-primary-container text-on-primary-container font-medium"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === "Profile Settings" && (
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-on-surface">Profile Information</h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium transition-colors"
                >
                  {isEditingProfile ? (
                    <>
                      <Check className="w-4 h-4" />
                      Done Editing
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-container text-primary flex items-center justify-center font-black text-3xl border-2 border-primary-container">
                    {profile.full_name?.charAt(0) || "A"}
                  </div>
                  {isEditingProfile && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center border-2 border-surface-container-lowest hover:bg-primary/90 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-lg">{profile.full_name || "Admin User"}</h3>
                  <p className="text-on-surface-variant text-sm">Super Admin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-on-surface-variant">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-on-surface-variant">Bio / Description</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface resize-none disabled:opacity-70"
                  ></textarea>
                </div>
              </div>
            </div>
          )}


          {activeTab === "Security & Passwords" && (
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-on-surface mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Change Password</h3>
                  <div className="space-y-4">
                    <input type="password" placeholder="Current Password" className="w-full max-w-md px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface" />
                    <input type="password" placeholder="New Password" className="w-full max-w-md px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface" />
                    <input type="password" placeholder="Confirm New Password" className="w-full max-w-md px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface" />
                    <button
                      onClick={() => toast.success("Password updated successfully")}
                      className="px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors text-sm"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="h-px bg-outline-variant/30 w-full my-6"></div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">Authenticator App</p>
                        <p className="text-sm text-on-surface-variant">Use an app like Google Authenticator to generate codes.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success("Two-Factor Authentication enabled")}
                      className="px-4 py-2 rounded-full bg-primary text-on-primary font-medium text-sm"
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-on-surface mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                {[
                  { title: "New Bookings", desc: "Get notified when a new tour is booked.", email: true, push: true },
                  { title: "Cancellations", desc: "Get notified when a booking is cancelled.", email: true, push: true },
                  { title: "New Reviews", desc: "Get notified when a customer leaves a review.", email: false, push: true },
                  { title: "System Updates", desc: "Receive alerts about system maintenance.", email: true, push: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-outline-variant/20 last:border-0">
                    <div>
                      <p className="font-medium text-on-surface">{item.title}</p>
                      <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={item.email} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                        <span className="text-sm text-on-surface-variant">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={item.push} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                        <span className="text-sm text-on-surface-variant">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Payment Gateways" && (
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-on-surface mb-6">Payment Gateways</h2>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold text-xl">
                      S
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">Stripe</p>
                      <p className="text-sm text-on-surface-variant">Credit card payments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-medium">Connected</span>
                    <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00457C]/10 text-[#00457C] flex items-center justify-center font-bold text-xl">
                      P
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">PayPal</p>
                      <p className="text-sm text-on-surface-variant">International payments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toast.success("Redirecting to PayPal...")}
                      className="px-4 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Localization" && (
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-on-surface mb-6">Localization Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Default Language</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface appearance-none">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Default Currency</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface appearance-none">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-on-surface-variant">Timezone</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface appearance-none">
                    <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                    <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                    <option>(GMT+00:00) London</option>
                    <option>(GMT+01:00) Paris, Berlin</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
