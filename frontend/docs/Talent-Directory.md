# Talent Directory

## 👥 Overview

The Talent Directory system provides a comprehensive platform for showcasing and connecting with Liberia's digital talent. It serves as a professional networking hub where tech professionals can create profiles, showcase their skills, and connect with opportunities.

## ✨ Key Features

- **Professional Profiles**: Create detailed professional profiles with skills and experience
- **Skills Showcase**: Highlight technical skills, certifications, and projects
- **Portfolio Integration**: Link to GitHub, personal websites, and project portfolios
- **Job Matching**: Algorithmic matching between talent and opportunities
- **Direct Messaging**: Secure communication between talent and recruiters
- **Verification System**: Professional identity and skills verification
- **Analytics Dashboard**: Track profile views, connections, and engagement

## 🏗️ Architecture

### Frontend Components

```
src/components/talent/
├── TalentCard.jsx          # Talent preview component
├── TalentProfile.jsx       # Full talent profile view
├── ProfileForm.jsx         # Profile creation/editing form
├── SkillsManager.jsx       # Skills and endorsements system
├── PortfolioViewer.jsx     # Portfolio showcase component
├── TalentSearch.jsx        # Advanced search and filtering
├── MessagingSystem.jsx     # Direct messaging component
└── TalentAnalytics.jsx     # Profile analytics dashboard
```

### Backend API

```
backend/src/routes/talents.js  # Talent directory CRUD operations
```

## 📝 Talent Profile Structure

```javascript
{
  id: "uuid",
  user_id: "user-uuid",
  first_name: "Jane",
  last_name: "Doe",
  professional_title: "Full Stack Developer",
  bio: "Passionate developer with 5+ years experience...",
  location: {
    city: "Monrovia",
    country: "Liberia",
    remote_work: true,
    relocation: false
  },
  contact_info: {
    email: "jane.doe@example.com",
    phone: "+231-xxx-xxxx",
    linkedin: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe",
    website: "https://janedoe.dev",
    portfolio: "https://portfolio.janedoe.dev"
  },
  skills: [
    {
      name: "JavaScript",
      level: "expert",
      years_experience: 5,
      endorsements: 12,
      verified: true
    },
    {
      name: "React",
      level: "advanced",
      years_experience: 3,
      endorsements: 8,
      verified: true
    }
  ],
  experience: [
    {
      id: "exp-1",
      title: "Senior Frontend Developer",
      company: "Tech Solutions Liberia",
      location: "Monrovia, Liberia",
      start_date: "2022-01-01",
      end_date: "present",
      current: true,
      description: "Lead frontend development for...",
      achievements: [
        "Improved application performance by 40%",
        "Led team of 3 developers"
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "BSc Computer Science",
      institution: "University of Liberia",
      location: "Monrovia, Liberia",
      start_date: "2016-09-01",
      end_date: "2020-06-30",
      gpa: "3.8/4.0",
      honors: ["Dean's List", "First Class Honors"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      issue_date: "2023-03-15",
      expiry_date: "2026-03-15",
      credential_id: "AWS-DEV-123456",
      verified: true
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution...",
      technologies: ["React", "Node.js", "MongoDB"],
      role: "Lead Developer",
      duration: "3 months",
      status: "completed",
      url: "https://github.com/janedoe/ecommerce",
      demo_url: "https://demo.ecommerce.dev"
    }
  ],
  availability: {
    job_seeking: true,
    freelance: true,
    collaboration: true,
    consulting: false,
    preferred_work_type: ["full-time", "remote"],
    salary_expectation: {
      min: 50000,
      max: 80000,
      currency: "USD",
      period: "yearly"
    }
  },
  preferences: {
    company_size: ["startup", "small", "medium"],
    industry: ["technology", "fintech", "healthcare"],
    work_environment: ["remote", "hybrid"],
    role_type: ["frontend", "full-stack", "team-lead"]
  },
  stats: {
    profile_views: 1250,
    connection_requests: 45,
    messages_received: 23,
    endorsements_received: 67,
    last_active: "2024-01-15T10:30:00Z"
  },
  verification_status: {
    identity_verified: true,
    skills_verified: 8,
    education_verified: true,
    employment_verified: true
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T10:30:00Z"
}
```

## 🎯 Profile Categories

### Developers
- **Frontend Developers**: React, Vue, Angular specialists
- **Backend Developers**: Node.js, Python, Java specialists
- **Full Stack Developers**: End-to-end development expertise
- **Mobile Developers**: iOS, Android, React Native
- **DevOps Engineers**: Cloud, CI/CD, infrastructure

### Designers
- **UI/UX Designers**: User interface and experience design
- **Graphic Designers**: Visual design and branding
- **Product Designers**: Product strategy and design systems
- **Web Designers**: Frontend design and implementation

### Other Tech Roles
- **Data Scientists**: Analytics, machine learning, AI
- **Project Managers**: Agile, Scrum, project coordination
- **Technical Writers**: Documentation, content creation
- **QA Engineers**: Testing, quality assurance

## 🔧 Profile Management

### Profile Creation Form

```jsx
// ProfileForm.jsx
function ProfileForm({ profile, onSave, onCancel }) {
  const [formData, setFormData] = useState(profile || {
    first_name: '',
    last_name: '',
    professional_title: '',
    bio: '',
    location: {
      city: '',
      country: 'Liberia',
      remote_work: false,
      relocation: false
    },
    contact_info: {
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      website: '',
      portfolio: ''
    },
    skills: [],
    availability: {
      job_seeking: true,
      freelance: false,
      collaboration: false,
      consulting: false
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Professional Title *
        </label>
        <input
          type="text"
          value={formData.professional_title}
          onChange={(e) => setFormData({...formData, professional_title: e.target.value})}
          placeholder="e.g., Full Stack Developer"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Professional Bio *
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          rows={4}
          placeholder="Tell us about your professional background and expertise..."
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) => setFormData({
                ...formData,
                location: {...formData.location, city: e.target.value}
              })}
              placeholder="City"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <select
              value={formData.location.country}
              onChange={(e) => setFormData({
                ...formData,
                location: {...formData.location, country: e.target.value}
              })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="Liberia">Liberia</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.location.remote_work}
              onChange={(e) => setFormData({
                ...formData,
                location: {...formData.location, remote_work: e.target.checked}
              })}
              className="mr-2"
            />
            Open to remote work
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.location.relocation}
              onChange={(e) => setFormData({
                ...formData,
                location: {...formData.location, relocation: e.target.checked}
              })}
              className="mr-2"
            />
            Open to relocation
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Information
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="email"
              value={formData.contact_info.email}
              onChange={(e) => setFormData({
                ...formData,
                contact_info: {...formData.contact_info, email: e.target.value}
              })}
              placeholder="Email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <input
              type="tel"
              value={formData.contact_info.phone}
              onChange={(e) => setFormData({
                ...formData,
                contact_info: {...formData.contact_info, phone: e.target.value}
              })}
              placeholder="Phone"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <input
              type="url"
              value={formData.contact_info.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                contact_info: {...formData.contact_info, linkedin: e.target.value}
              })}
              placeholder="LinkedIn URL"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <input
              type="url"
              value={formData.contact_info.github}
              onChange={(e) => setFormData({
                ...formData,
                contact_info: {...formData.contact_info, github: e.target.value}
              })}
              placeholder="GitHub URL"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability Preferences
        </label>
        <div className="space-y-2">
          {[
            { key: 'job_seeking', label: 'Open to job opportunities' },
            { key: 'freelance', label: 'Available for freelance work' },
            { key: 'collaboration', label: 'Open to project collaboration' },
            { key: 'consulting', label: 'Available for consulting' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.availability[key]}
                onChange={(e) => setFormData({
                  ...formData,
                  availability: {...formData.availability, [key]: e.target.checked}
                })}
                className="mr-2"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
}
```

## 🎨 Skills Management

### Skills Manager Component

```jsx
// SkillsManager.jsx
function SkillsManager({ skills, onUpdate }) {
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'intermediate',
    years_experience: 1
  });

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill = {
        ...newSkill,
        id: Date.now().toString(),
        endorsements: 0,
        verified: false
      };
      onUpdate([...skills, skill]);
      setNewSkill({ name: '', level: 'intermediate', years_experience: 1 });
    }
  };

  const removeSkill = (skillId) => {
    onUpdate(skills.filter(skill => skill.id !== skillId));
  };

  const updateSkill = (skillId, updates) => {
    onUpdate(skills.map(skill => 
      skill.id === skillId ? { ...skill, ...updates } : skill
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
      
      {/* Add new skill */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-3">Add New Skill</h4>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
            placeholder="Skill name (e.g., JavaScript, React)"
            className="flex-1 border-gray-300 rounded-md shadow-sm"
          />
          
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
            className="border-gray-300 rounded-md shadow-sm"
          >
            {skillLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            value={newSkill.years_experience}
            onChange={(e) => setNewSkill({...newSkill, years_experience: parseInt(e.target.value)})}
            placeholder="Years"
            min="0"
            max="50"
            className="w-20 border-gray-300 rounded-md shadow-sm"
          />
          
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Existing skills */}
      <div className="space-y-3">
        {skills.map(skill => (
          <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium">{skill.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  skill.level === 'expert' ? 'bg-purple-100 text-purple-800' :
                  skill.level === 'advanced' ? 'bg-blue-100 text-blue-800' :
                  skill.level === 'intermediate' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {skill.level}
                </span>
                
                {skill.verified && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span>{skill.years_experience} years experience</span>
                <span>{skill.endorsements} endorsements</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No skills added yet. Add your first skill above.
        </div>
      )}
    </div>
  );
}
```

## 🔍 Talent Search

### Advanced Search Component

```jsx
// TalentSearch.jsx
function TalentSearch({ onSearch }) {
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    skills: [],
    location: '',
    remote_work: false,
    availability: [],
    experience_level: [],
    company_size: [],
    industry: []
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchTalent(searchFilters);
      onSearch(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (skill) => {
    if (searchFilters.skills.includes(skill)) {
      setSearchFilters(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }));
    } else {
      setSearchFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java',
    'UI/UX Design', 'Project Management', 'Data Science',
    'DevOps', 'Mobile Development', 'AWS', 'MongoDB'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Search Talent</h3>
      
      <div className="space-y-4">
        {/* Keyword search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords
          </label>
          <input
            type="text"
            value={searchFilters.keyword}
            onChange={(e) => setSearchFilters({...searchFilters, keyword: e.target.value})}
            placeholder="Search by title, skills, or bio..."
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        {/* Skills filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSkills.map(skill => (
              <button
                key={skill}
                onClick={() => handleSkillChange(skill)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  searchFilters.skills.includes(skill)
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        
        {/* Location filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={searchFilters.location}
            onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
            placeholder="City or country..."
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        {/* Availability filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Availability
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'job_seeking', label: 'Job Seeking' },
              { key: 'freelance', label: 'Freelance' },
              { key: 'collaboration', label: 'Collaboration' },
              { key: 'consulting', label: 'Consulting' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={searchFilters.availability.includes(key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSearchFilters(prev => ({
                        ...prev,
                        availability: [...prev.availability, key]
                      }));
                    } else {
                      setSearchFilters(prev => ({
                        ...prev,
                        availability: prev.availability.filter(a => a !== key)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        
        {/* Remote work filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={searchFilters.remote_work}
              onChange={(e) => setSearchFilters({...searchFilters, remote_work: e.target.checked})}
              className="mr-2"
            />
            Open to remote work
          </label>
        </div>
        
        {/* Search button */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setSearchFilters({
              keyword: '',
              skills: [],
              location: '',
              remote_work: false,
              availability: [],
              experience_level: [],
              company_size: [],
              industry: []
            })}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Talent Display

### Talent Card Component

```jsx
// TalentCard.jsx
function TalentCard({ talent }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleFollow = async () => {
    try {
      await followTalent(talent.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  const handleConnect = () => {
    setShowMessageModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={talent.avatar || '/default-avatar.png'}
            alt={`${talent.first_name} ${talent.last_name}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">
              {talent.first_name} {talent.last_name}
            </h3>
            <p className="text-gray-600 mb-2">{talent.professional_title}</p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {talent.bio}
            </p>
          </div>
          
          <div className="text-right">
            {talent.verification_status.identity_verified && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mb-2">
                ✓ Verified
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              {talent.location.city}, {talent.location.country}
            </div>
          </div>
        </div>
        
        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
          <div className="flex flex-wrap gap-2">
            {talent.skills.slice(0, 5).map(skill => (
              <span
                key={skill.id}
                className={`px-2 py-1 rounded-full text-xs ${
                  skill.level === 'expert' ? 'bg-purple-100 text-purple-800' :
                  skill.level === 'advanced' ? 'bg-blue-100 text-blue-800' :
                  skill.level === 'intermediate' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {skill.name}
                {skill.verified && ' ✓'}
              </span>
            ))}
            {talent.skills.length > 5 && (
              <span className="text-gray-500 text-xs">+{talent.skills.length - 5} more</span>
            )}
          </div>
        </div>
        
        {/* Experience */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience</h4>
          <div className="text-sm text-gray-600">
            {talent.experience.length > 0 ? (
              <div>
                <span className="font-medium">{talent.experience[0].title}</span>
                <span className="text-gray-500"> at {talent.experience[0].company}</span>
              </div>
            ) : (
              <span>No experience listed</span>
            )}
          </div>
        </div>
        
        {/* Availability */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {talent.availability.job_seeking && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Job Seeking
              </span>
            )}
            {talent.availability.freelance && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Freelance
              </span>
            )}
            {talent.location.remote_work && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                Remote
              </span>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>{talent.stats.profile_views} views</span>
            <span>{talent.skills.reduce((sum, skill) => sum + skill.endorsements, 0)} endorsements</span>
          </div>
          
          <div className="text-xs text-gray-400">
            Last active {formatDate(talent.stats.last_active)}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleConnect}
            className="flex-1 px-3 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 text-sm"
          >
            Connect
          </button>
          
          <button
            onClick={handleFollow}
            className={`px-3 py-2 rounded-md text-sm ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          
          <Button variant="outline" size="sm" as={Link} to={`/talent/${talent.id}`}>
            View Profile
          </Button>
        </div>
      </div>
      
      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          recipient={talent}
          onClose={() => setShowMessageModal(false)}
          onSend={(message) => {
            // Handle message sending
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
  );
}
```

## 🔧 API Integration

### Talent Hooks

```javascript
// hooks/useTalent.js
export const useTalent = () => {
  return {
    // Get all talent profiles
    getAll: async (params = {}) => {
      const response = await apiRequest(`/v1/talents?${queryParams.toString()}`);
      return response;
    },

    // Get single talent profile
    getById: async (id) => {
      return await apiRequest(`/v1/talents/${id}`);
    },

    // Create/update talent profile
    saveProfile: async (profileData) => {
      return await apiRequest('/v1/talents/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      });
    },

    // Update skills
    updateSkills: async (skills) => {
      return await apiRequest('/v1/talents/skills', {
        method: 'PUT',
        body: JSON.stringify({ skills }),
      });
    },

    // Search talent
    search: async (filters) => {
      return await apiRequest('/v1/talents/search', {
        method: 'POST',
        body: JSON.stringify(filters),
      });
    },

    // Follow/unfollow talent
    followTalent: async (talentId) => {
      return await apiRequest(`/v1/talents/${talentId}/follow`, {
        method: 'POST',
      });
    },

    // Send message
    sendMessage: async (recipientId, message) => {
      return await apiRequest('/v1/talents/messages', {
        method: 'POST',
        body: JSON.stringify({ recipientId, message }),
      });
    },

    // Get profile analytics
    getAnalytics: async () => {
      return await apiRequest('/v1/talents/analytics');
    },

    // Endorse skill
    endorseSkill: async (talentId, skillId) => {
      return await apiRequest(`/v1/talents/${talentId}/skills/${skillId}/endorse`, {
        method: 'POST',
      });
    },
  };
};
```

## 📊 Analytics Dashboard

### Profile Analytics Component

```jsx
// TalentAnalytics.jsx
function TalentAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTalentAnalytics().then(data => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Profile Views</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.profile_views}</p>
          <p className="text-sm text-green-600">+20% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Connection Requests</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.connection_requests}</p>
          <p className="text-sm text-blue-600">This month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Messages Received</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.messages_received}</p>
          <p className="text-sm text-green-600">+5 from last week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Skill Endorsements</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.endorsements}</p>
          <p className="text-sm text-blue-600">Total</p>
        </div>
      </div>
      
      {/* Charts and additional analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Profile Views Trend</h3>
          {/* Chart component */}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Popular Skills</h3>
          {/* Skills chart */}
        </div>
      </div>
    </div>
  );
}
```

## 📋 Best Practices

### Profile Optimization

1. **Professional Photo**: Use a high-quality, professional headshot
2. **Complete Profile**: Fill out all sections of your profile
3. **Skills Verification**: Get your skills verified by peers or employers
4. **Portfolio Links**: Include links to GitHub, personal website, and projects
5. **Regular Updates**: Keep your profile current with latest experience

### Networking

1. **Personalized Messages**: Send thoughtful, personalized connection requests
2. **Skill Endorsements**: Endorse skills of connections to build relationships
3. **Active Engagement**: Regularly update your profile and engage with the community
4. **Professional Communication**: Maintain professional tone in all interactions
5. **Follow Up**: Respond promptly to messages and connection requests

### Privacy & Security

1. **Contact Information**: Be selective about what contact info to display publicly
2. **Privacy Settings**: Adjust privacy settings to control who can see your profile
3. **Verification**: Complete identity verification for increased trust
4. **Secure Messaging**: Use the platform's messaging system for initial contacts
5. **Report Issues**: Report suspicious or inappropriate behavior

This Talent Directory system provides comprehensive functionality for showcasing and connecting with Liberia's digital talent, fostering professional growth and opportunities in the tech ecosystem.