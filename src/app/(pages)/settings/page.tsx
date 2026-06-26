import PageHeader from "@/components/PageHeader";
import SettingsForm from "./settingsForm";
import { getCurrentUserSettings } from "@/lib/settings/getCurrentUserSettings";

export default async function SettingsPage() {
  const user = await getCurrentUserSettings();

  return (
    <div className="space-y-6">
      <PageHeader name="Settings" isDemo={false} />
      <SettingsForm user={user} />
    </div>
  );
}
