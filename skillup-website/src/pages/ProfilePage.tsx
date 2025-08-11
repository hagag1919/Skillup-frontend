import { useState } from 'react';
import { useAppSelector } from '../store/hooks.js';
import Button from '../components/ui/Button.js';
import Card from '../components/ui/Card.js';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      location: '',
      website: '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center">
                <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-4 space-y-2">
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-block">
                    Student
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.email || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.location || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.website ? (
                          <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {formData.website}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.bio || 'Not set'}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Learning Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Learning Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">React Fundamentals</h4>
                    <p className="text-sm text-gray-600">Last accessed 2 days ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">75%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">JavaScript Essentials</h4>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">100%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">TypeScript Mastery</h4>
                    <p className="text-sm text-gray-600">Started 1 week ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">30%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <p className="text-gray-900">Completed lesson "React Hooks"</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                    🏆
                  </div>
                  <div>
                    <p className="text-gray-900">Earned "JavaScript Expert" badge</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                    📚
                  </div>
                  <div>
                    <p className="text-gray-900">Started "TypeScript Mastery" course</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
