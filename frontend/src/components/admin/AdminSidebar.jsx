import {
  FaHome,
  FaNewspaper,
  FaMicrophone,
  FaCalendar,
  FaUsers,
  FaGraduationCap,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaLightbulb,
  FaBullhorn,
  FaEnvelope,
} from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'articles', label: 'Articles', icon: FaNewspaper },
    { id: 'insights', label: 'Insights', icon: FaLightbulb },
    { id: 'podcasts', label: 'Podcasts', icon: FaMicrophone },
    { id: 'events', label: 'Events', icon: FaCalendar },
    { id: 'talents', label: 'Talent Hub', icon: FaUsers },
    { id: 'training', label: 'Training', icon: FaGraduationCap },
    { id: 'advertisements', label: 'Advertisements', icon: FaBullhorn },
    { id: 'newsletter', label: 'Newsletter', icon: FaEnvelope },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div
      className={`bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-brand-500 text-white'
                      : 'hover:bg-[var(--color-muted)] text-[var(--color-text)]'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
