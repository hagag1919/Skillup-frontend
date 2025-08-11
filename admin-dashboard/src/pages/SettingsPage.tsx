import React, { useState } from 'react';
import { Save, User, Bell, Database, Server } from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'SkillUp Learning Platform',
    siteDescription: 'Empowering learners worldwide with quality education',
    contactEmail: 'admin@skillup.com',
    supportEmail: 'support@skillup.com',
    maxFileSize: '100',
    allowRegistration: true,
    requireEmailVerification: true,
  });

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving general settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
        <p className="text-sm text-gray-600">Configure basic platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            placeholder="Enter site name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            placeholder="Enter contact email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            rows={3}
            placeholder="Enter site description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            placeholder="Enter support email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRegistration"
            checked={settings.allowRegistration}
            onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="allowRegistration" className="ml-2 block text-sm text-gray-900">
            Allow new user registration
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireEmailVerification"
            checked={settings.requireEmailVerification}
            onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
            Require email verification for new accounts
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const UserManagementSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultRole: 'STUDENT',
    autoApproveInstructors: false,
    allowRoleChange: true,
    sessionTimeout: '24',
    passwordMinLength: '8',
    requireStrongPassword: true,
  });

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving user management settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <p className="text-sm text-gray-600">Configure user registration and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default User Role</label>
          <select
            value={settings.defaultRole}
            onChange={(e) => setSettings({ ...settings, defaultRole: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (hours)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoApproveInstructors"
            checked={settings.autoApproveInstructors}
            onChange={(e) => setSettings({ ...settings, autoApproveInstructors: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="autoApproveInstructors" className="ml-2 block text-sm text-gray-900">
            Auto-approve instructor applications
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRoleChange"
            checked={settings.allowRoleChange}
            onChange={(e) => setSettings({ ...settings, allowRoleChange: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="allowRoleChange" className="ml-2 block text-sm text-gray-900">
            Allow admins to change user roles
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireStrongPassword"
            checked={settings.requireStrongPassword}
            onChange={(e) => setSettings({ ...settings, requireStrongPassword: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="requireStrongPassword" className="ml-2 block text-sm text-gray-900">
            Require strong passwords (uppercase, lowercase, numbers, symbols)
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    newUserRegistration: true,
    coursePublished: true,
    systemErrors: true,
    weeklyReport: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
  });

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving notification settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
        <p className="text-sm text-gray-600">Configure email notifications and SMTP settings</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailNotifications"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
            Enable email notifications
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="newUserRegistration"
            checked={settings.newUserRegistration}
            onChange={(e) => setSettings({ ...settings, newUserRegistration: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="newUserRegistration" className="ml-2 block text-sm text-gray-900">
            Notify on new user registrations
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="coursePublished"
            checked={settings.coursePublished}
            onChange={(e) => setSettings({ ...settings, coursePublished: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="coursePublished" className="ml-2 block text-sm text-gray-900">
            Notify when courses are published
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="systemErrors"
            checked={settings.systemErrors}
            onChange={(e) => setSettings({ ...settings, systemErrors: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="systemErrors" className="ml-2 block text-sm text-gray-900">
            Notify on system errors
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="weeklyReport"
            checked={settings.weeklyReport}
            onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="weeklyReport" className="ml-2 block text-sm text-gray-900">
            Send weekly analytics report
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">SMTP Configuration</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
            <input
              type="text"
              value={settings.smtpPort}
              onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
            <input
              type="text"
              value={settings.smtpUsername}
              onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: '1000',
    cacheEnabled: true,
    logLevel: 'INFO',
    backupFrequency: 'daily',
  });

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving system settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
        <p className="text-sm text-gray-600">Configure system behavior and performance settings</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
            Enable maintenance mode
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="debugMode"
            checked={settings.debugMode}
            onChange={(e) => setSettings({ ...settings, debugMode: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="debugMode" className="ml-2 block text-sm text-gray-900">
            Enable debug mode
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="cacheEnabled"
            checked={settings.cacheEnabled}
            onChange={(e) => setSettings({ ...settings, cacheEnabled: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="cacheEnabled" className="ml-2 block text-sm text-gray-900">
            Enable caching
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Rate Limit (requests/hour)</label>
          <input
            type="number"
            value={settings.apiRateLimit}
            onChange={(e) => setSettings({ ...settings, apiRateLimit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
          <select
            value={settings.logLevel}
            onChange={(e) => setSettings({ ...settings, logLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ERROR">Error</option>
            <option value="WARN">Warning</option>
            <option value="INFO">Info</option>
            <option value="DEBUG">Debug</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const settingsSections: SettingsSection[] = [
  {
    id: 'general',
    title: 'General',
    icon: Server,
    component: GeneralSettings,
  },
  {
    id: 'users',
    title: 'User Management',
    icon: User,
    component: UserManagementSettings,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    component: NotificationSettings,
  },
  {
    id: 'system',
    title: 'System',
    icon: Database,
    component: SystemSettings,
  },
];

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  const activeComponent = settingsSections.find(section => section.id === activeSection)?.component;
  const ActiveComponent = activeComponent || GeneralSettings;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your platform settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
