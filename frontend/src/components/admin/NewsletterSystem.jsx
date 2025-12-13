import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Modal,
  RichTextEditor,
} from '../ui';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaEnvelope,
  FaUsers,
  FaCalendar,
  FaPaperPlane,
  FaTimes,
  FaChartBar,
  FaReply,
  FaUserPlus,
  FaFileAlt,
  FaBullhorn,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  useNewsletters,
  useNewsletterTemplates,
  useNewsletterSubscribers,
  useNewsletterSubscribersList,
  useNewsletterAnalytics,
} from '../../hooks/useBackendApi';
import { backendApi } from '../../services/backendApi';
import { useToast } from '../../context/ToastContext';
import {
  newsletterTemplates,
  sampleSubscribers,
  sampleReplies,
} from '../../data/newsletterTemplates';

const NewsletterSystem = ({ canEdit }) => {
  const { showToast } = useToast();
  const {
    data: newslettersData,
    refetch: refetchNewsletters,
    error: newslettersError,
  } = useNewsletters({});
  const { data: templatesData, error: templatesError } = useNewsletterTemplates();
  const { data: subscribersData, error: subscribersError } = useNewsletterSubscribers({});
  const { data: subscribersListData, refetch: refetchSubscribers } = useNewsletterSubscribersList(
    {},
  );
  const { data: analyticsData } = useNewsletterAnalytics();

  // Check if we're using fallback data
  const usingFallbackData = newslettersError || templatesError || subscribersError;

  // Add fallback data when API fails
  const newsletters = newslettersData?.newsletters || [
    {
      id: 'newsletter-1',
      title: 'Monthly Digest - November 2024',
      subject: 'November 2024 - Liberia Digital Insights Monthly Digest',
      content: '<p>This month we have exciting updates...</p>',
      status: 'sent',
      createdAt: '2024-11-01T10:00:00Z',
      sentAt: '2024-11-01T12:00:00Z',
      recipientCount: 1234,
      openRate: 12.8,
      clickRate: 3.2,
    },
    {
      id: 'newsletter-2',
      title: 'Training Opportunity: Digital Marketing Basics',
      subject: '🎓 New Training Opportunity: Digital Marketing Basics',
      content: '<p>Join our upcoming training session...</p>',
      status: 'draft',
      createdAt: '2024-11-15T09:00:00Z',
      sentAt: null,
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
    },
    {
      id: 'newsletter-3',
      title: 'Event Invitation: Tech Summit 2024',
      subject: "🎉 You're Invited: Tech Summit 2024",
      content: '<p>We invite you to our annual tech summit...</p>',
      status: 'scheduled',
      createdAt: '2024-11-20T14:00:00Z',
      sentAt: null,
      recipientCount: 856,
      openRate: 0,
      clickRate: 0,
    },
  ];
  const templates = templatesData?.templates || newsletterTemplates;
  const subscribers =
    subscribersListData?.subscribers || subscribersData?.subscribers || sampleSubscribers;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);
  const [showRepliesModal, setShowRepliesModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [selectedReplies, setSelectedReplies] = useState([]);

  // Simplified modal setters
  const openSubscribersModal = () => {
    setShowSubscribersModal(true);
  };

  const openTemplateModal = () => {
    setShowTemplateModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    template: '',
    status: 'draft',
  });

  // Send modal states
  const [sendData, setSendData] = useState({
    recipients: 'all',
    customRecipients: [],
    scheduleType: 'immediate',
    scheduledAt: '',
  });

  // Reply states
  const [replyContent, setReplyContent] = useState('');
  const [replyToSubscriber, setReplyToSubscriber] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesSearch =
      (newsletter.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (newsletter.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNewsletter = async () => {
    try {
      await backendApi.newsletters.create(formData);
      showToast('Newsletter created successfully', 'success');
      setShowCreateModal(false);
      setFormData({ title: '', subject: '', content: '', template: '', status: 'draft' });
      refetchNewsletters();
    } catch {
      showToast('Failed to create newsletter', 'error');
    }
  };

  const handleSendNewsletter = async () => {
    try {
      const recipientData = {
        recipients: sendData.recipients === 'custom' ? sendData.customRecipients : undefined,
        scheduleType: sendData.scheduleType,
        scheduledAt: sendData.scheduledAt,
      };
      await backendApi.newsletters.send(selectedNewsletter.id, recipientData);
      showToast('Newsletter sent successfully', 'success');
      setShowSendModal(false);
      setSelectedNewsletter(null);
      refetchNewsletters();
    } catch {
      showToast('Failed to send newsletter', 'error');
    }
  };

  const handleReplyToSubscriber = async () => {
    try {
      await backendApi.newsletters.replyToSubscriber(selectedNewsletter.id, {
        subscriberId: replyToSubscriber.id,
        content: replyContent,
      });
      showToast('Reply sent successfully', 'success');
      setReplyContent('');
      setReplyToSubscriber(null);
      // Refresh replies
      if (selectedNewsletter) {
        const replies = await backendApi.newsletters.getReplies(selectedNewsletter.id);
        setSelectedReplies(replies.replies || []);
      }
    } catch {
      showToast('Failed to send reply', 'error');
    }
  };

  const handleViewReplies = async (newsletter) => {
    try {
      const replies = await backendApi.newsletters.getReplies(newsletter.id);
      setSelectedReplies(replies.replies || []);
    } catch {
      // Use fallback sample data if API fails
      setSelectedReplies(
        sampleReplies.filter((reply) => reply.newsletterId === newsletter.id) || [],
      );
      showToast('Using sample reply data', 'info');
    }
    setSelectedNewsletter(newsletter);
    setShowRepliesModal(true);
  };

  const handleApplyTemplate = (template) => {
    setFormData({
      ...formData,
      content: template.content,
      subject: template.subject || formData.subject,
    });
  };

  const handleEdit = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      subject: newsletter.subject,
      content: newsletter.content,
      template: newsletter.template || '',
      status: newsletter.status,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (newsletter) => {
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      try {
        await backendApi.newsletters.delete(newsletter.id);
        showToast('Newsletter deleted successfully', 'success');
        refetchNewsletters();
      } catch {
        showToast('Failed to delete newsletter', 'error');
      }
    }
  };

  const handleDeleteSubscriber = async (subscriberId) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await backendApi.newsletters.deleteSubscriber(subscriberId);
        showToast('Subscriber deleted successfully', 'success');
        refetchSubscribers();
      } catch {
        showToast('Failed to delete subscriber', 'error');
      }
    }
  };

  const handleUpdateSubscriberStatus = async (subscriberId, status) => {
    try {
      await backendApi.newsletters.updateSubscriberStatus(subscriberId, status);
      showToast('Subscriber status updated successfully', 'success');
      refetchSubscribers();
    } catch {
      showToast('Failed to update subscriber status', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'draft':
        return <FaFileAlt className="w-4 h-4 text-gray-500" />;
      default:
        return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning banner when using fallback data */}
      {usingFallbackData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <FaExclamationTriangle className="text-yellow-600 w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Using sample data - Backend API unavailable
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              The newsletter system is currently using sample data. Some features may not work until
              the backend is available.
            </p>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Search newsletters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
            icon={<FaSearch />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-32"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={openSubscribersModal}>
            <FaUsers className="w-4 h-4 mr-2" />
            Manage Subscribers
          </Button>
          <Button variant="outline" type="button" onClick={openTemplateModal}>
            <FaFileAlt className="w-4 h-4 mr-2" />
            Templates
          </Button>
          {canEdit && (
            <Button type="button" onClick={openCreateModal}>
              <FaPlus className="w-4 h-4 mr-2" />
              Create Newsletter
            </Button>
          )}
        </div>
      </div>

      {/* Newsletter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Active Subscribers</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {analyticsData?.subscribers?.active || '8,456'}
                </p>
                <p className="text-sm text-green-600">
                  +{analyticsData?.subscribers?.recentSubscriptions || '156'} new this month
                </p>
              </div>
              <FaUsers className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Newsletters Sent</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {analyticsData?.newsletters?.sent || '1,234'}
                </p>
                <p className="text-sm text-green-600">
                  {analyticsData?.newsletters?.drafts || '2'} drafts ready
                </p>
              </div>
              <FaEnvelope className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Growth Rate</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {analyticsData?.subscribers?.growthRate || '12'}%
                </p>
                <p className="text-sm text-green-600">
                  +{analyticsData?.subscribers?.growthRate || '2.1'}% from last month
                </p>
              </div>
              <FaChartBar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-muted)]">Unsubscribe Rate</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {analyticsData?.metrics?.unsubscribeRate || '3.2'}%
                </p>
                <p className="text-sm text-red-600">
                  -{analyticsData?.subscribers?.recentUnsubscriptions || '5'} this month
                </p>
              </div>
              <FaEye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletters Table */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletters</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-surface)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter.id} className="hover:bg-[var(--color-surface)]">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(newsletter.status)}
                        <span className="ml-2 text-sm font-medium text-[var(--color-text)]">
                          {newsletter.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                      {newsletter.subject}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          newsletter.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : newsletter.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {newsletter.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-muted)]">
                      {newsletter.createdAt
                        ? new Date(newsletter.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--color-muted)]">
                      {newsletter.sentAt
                        ? new Date(newsletter.sentAt).toLocaleDateString()
                        : 'Not sent'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReplies(newsletter)}
                          title="View Replies"
                        >
                          <FaReply className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedNewsletter(newsletter);
                            setShowSendModal(true);
                          }}
                          title="Send Newsletter"
                          disabled={newsletter.status === 'sent'}
                        >
                          <FaPaperPlane className="w-3 h-3" />
                        </Button>
                        {canEdit && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(newsletter)}
                            >
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(newsletter)}
                            >
                              <FaTrash className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Newsletter Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Newsletter"
      >
        <div className="space-y-4">
          <Input
            label="Newsletter Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter newsletter title"
          />
          <Input
            label="Email Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter email subject"
          />

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Template (Optional)
            </label>
            <Select
              value={formData.template}
              onChange={(e) => {
                const template = templates.find((t) => t.id === e.target.value);
                if (template) {
                  handleApplyTemplate(template);
                }
              }}
              className="w-full"
            >
              <option value="">Choose a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template?.name || 'Untitled Template'}
                </option>
              ))}
            </Select>
          </div>

          <RichTextEditor
            label="Content"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write your newsletter content..."
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewsletter}>Create Newsletter</Button>
          </div>
        </div>
      </Modal>

      {/* Send Newsletter Modal */}
      <Modal isOpen={showSendModal} onClose={() => setShowSendModal(false)} title="Send Newsletter">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Recipients
            </label>
            <Select
              value={sendData.recipients}
              onChange={(e) => setSendData({ ...sendData, recipients: e.target.value })}
              className="w-full"
            >
              <option value="all">All Subscribers</option>
              <option value="active">Active Subscribers</option>
              <option value="custom">Custom Selection</option>
            </Select>
          </div>

          {sendData.recipients === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Select Subscribers
              </label>
              <div className="border border-[var(--color-border)] rounded-lg p-4 max-h-40 overflow-y-auto">
                {subscribers.map((subscriber) => (
                  <label key={subscriber.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={sendData.customRecipients.includes(subscriber.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSendData({
                            ...sendData,
                            customRecipients: [...sendData.customRecipients, subscriber.id],
                          });
                        } else {
                          setSendData({
                            ...sendData,
                            customRecipients: sendData.customRecipients.filter(
                              (id) => id !== subscriber.id,
                            ),
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{subscriber.email}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Schedule
            </label>
            <Select
              value={sendData.scheduleType}
              onChange={(e) => setSendData({ ...sendData, scheduleType: e.target.value })}
              className="w-full"
            >
              <option value="immediate">Send Immediately</option>
              <option value="scheduled">Schedule for Later</option>
            </Select>
          </div>

          {sendData.scheduleType === 'scheduled' && (
            <Input
              label="Schedule Date & Time"
              type="datetime-local"
              value={sendData.scheduledAt}
              onChange={(e) => setSendData({ ...sendData, scheduledAt: e.target.value })}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSendModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNewsletter}>Send Newsletter</Button>
          </div>
        </div>
      </Modal>

      {/* Replies Modal */}
      <Modal
        isOpen={showRepliesModal}
        onClose={() => setShowRepliesModal(false)}
        title={`Replies - ${selectedNewsletter?.title}`}
        size="large"
      >
        <div className="space-y-4">
          {selectedReplies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {reply.subscriber?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {reply.subscriber?.email || 'No email'}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">
                    {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <p className="text-sm text-[var(--color-text)] mb-2">
                  {reply?.content || 'No content'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyToSubscriber(reply.subscriber)}
                >
                  <FaReply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Reply Form */}
          {replyToSubscriber && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-[var(--color-text)] mb-2">
                  Reply to {replyToSubscriber?.name || 'Unknown'}
                </h4>
                <textarea
                  className="w-full p-2 border border-[var(--color-border)] rounded-lg"
                  rows="4"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => setReplyToSubscriber(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReplyToSubscriber}>Send Reply</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Modal>

      {/* Subscribers Modal */}
      <Modal
        isOpen={showSubscribersModal}
        onClose={() => setShowSubscribersModal(false)}
        title="Manage Subscribers"
        size="large"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[var(--color-muted)]">
              Total Subscribers: {subscribers.length}
            </p>
            <Button>
              <FaUserPlus className="w-4 h-4 mr-2" />
              Add Subscribers
            </Button>
          </div>
          <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--color-surface)]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-muted)]">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-muted)]">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-muted)]">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-muted)]">
                    Joined
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-[var(--color-muted)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="px-4 py-2 text-sm">{subscriber?.name || 'Unknown'}</td>
                    <td className="px-4 py-2 text-sm">{subscriber?.email || 'No email'}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-muted)]">
                      {subscriber.subscribed_at || subscriber.createdAt
                        ? new Date(
                            subscriber.subscribed_at || subscriber.createdAt,
                          ).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        {subscriber.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateSubscriberStatus(subscriber.id, 'unsubscribed')
                            }
                          >
                            Unsubscribe
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                        >
                          <FaTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Templates Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Newsletter Templates"
        size="large"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[var(--color-muted)]">
              Available Templates: {templates.length}
            </p>
            <Button>
              <FaPlus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">
                    {template?.name || 'Untitled Template'}
                  </h4>
                  <p className="text-sm text-[var(--color-muted)] mb-2">
                    {template?.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--color-muted)]">
                      {template?.category || 'General'}
                    </span>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewsletterSystem;
