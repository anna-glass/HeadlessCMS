import { AccountSettings } from '@stackframe/stack';

export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <AccountSettings />
      </div>
    </div>
  );
} 