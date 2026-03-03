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
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, tabs = [] }) => {
  const { logout } = useAuth();
  const iconMap = {
    dashboard: FaHome,
    articles: FaNewspaper,
    insights: FaLightbulb,
    podcasts: FaMicrophone,
    events: FaCalendar,
    gallery: FaBars, // Using FaBars for gallery as a fallback or similar
    talents: FaUsers,
    training: FaGraduationCap,
    advertisements: FaBullhorn,
    newsletter: FaEnvelope,
    analytics: FaChartBar,
    users: FaUsers,
    settings: FaCog,
  };

  const menuItems = tabs.map((tab) => ({
    ...tab,
    icon: iconMap[tab.id] || FaHome,
  }));

  return (
    <div
      className={`bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 flex flex-col ${
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

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-[var(--color-border)]">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-red-50 text-red-600`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
