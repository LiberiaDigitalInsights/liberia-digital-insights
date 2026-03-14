"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEnvelope,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartBar,
} from "react-icons/fa";
import {
  useNewsletters,
  useNewsletterSubscribers,
  useNewsletterTemplates,
  sendNewsletter,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  deleteSubscriber,
  updateSubscriberStatus,
} from "@/hooks/useBackendApi";
import { useToast } from "@/context/ToastContext";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("../ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-muted rounded-lg" />
  ),
});

export default function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: newslettersData,
    loading: loadingCampaigns,
    refetch: refetchCampaigns,
  } = useNewsletters();
  const {
    data: subscribersData,
    loading: loadingSubscribers,
    refetch: refetchSubscribers,
  } = useNewsletterSubscribers();
  const { data: templatesData } = useNewsletterTemplates();
  const { showToast } = useToast();

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
    status: "draft",
  });

  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [sendingNewsletter, setSendingNewsletter] = useState(null);
  const [recipientSearch, setRecipientSearch] = useState("");

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      content: "",
      status: "draft",
    });
    setEditingItem(null);
  };

  const handleApplyTemplate = (template) => {
    setFormData({
      ...formData,
      subject: template.subject || formData.subject,
      content: template.content || formData.content,
    });
    setShowTemplateModal(false);
    showToast({
      title: "Template Applied",
      description: `Applied "${template.name}" template.`,
      variant: "info",
    });
  };

  const handleStatusToggle = async (subscriber) => {
    const newStatus =
      subscriber.status === "active" ? "unsubscribed" : "active";
    try {
      await updateSubscriberStatus(subscriber.id, newStatus);
      showToast({
        title: "Status Updated",
        description: `Subscriber ${subscriber.email} is now ${newStatus}.`,
        variant: "success",
      });
      await refetchSubscribers();
    } catch (error) {
      showToast({
        title: "Update Failed",
        description: error.message,
        variant: "danger",
      });
    }
  };

  const handleSend = (newsletter) => {
    setSendingNewsletter(newsletter);
    // Auto-select all active subscribers by default
    const activeSubIds = (subscribersData?.subscribers || [])
      .filter((s) => s.status === "active")
      .map((s) => s.id);
    setSelectedSubscribers(activeSubIds);
    setShowRecipientModal(true);
  };

  const toggleSubscriberSelection = (id) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (select) => {
    if (select) {
      const activeIds = (subscribersData?.subscribers || [])
        .filter((s) => s.status === "active")
        .map((s) => s.id);
      setSelectedSubscribers(activeIds);
    } else {
      setSelectedSubscribers([]);
    }
  };

  const confirmSend = async () => {
    if (selectedSubscribers.length === 0) {
      showToast({
        title: "No Recipients",
        description: "Please select at least one subscriber.",
        variant: "warning",
      });
      return;
    }

    const isResend = sendingNewsletter.status === "sent";
    setSubmitting(true);
    try {
      await sendNewsletter({
        newsletter_id: sendingNewsletter.id,
        subscriber_ids: selectedSubscribers,
      });
      showToast({
        title: isResend ? "Campaign Resent" : "Campaign Sent",
        description: `Newsletter is being dispatched to ${selectedSubscribers.length} selected recipients.`,
        variant: "success",
      });
      setShowRecipientModal(false);
      await refetchCampaigns();
    } catch (error) {
      showToast({
        title: "Dispatch Failed",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await updateNewsletter(editingItem.id, formData);
        showToast({
          title: "Updated",
          description: "Campaign updated.",
          variant: "success",
        });
      } else {
        await createNewsletter(formData);
        showToast({
          title: "Created",
          description: "New campaign created.",
          variant: "success",
        });
      }
      setShowModal(false);
      resetForm();
      await refetchCampaigns();
    } catch (error) {
      showToast({
        title: "Error",
        description: error.message,
        variant: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteNewsletter(id);
      showToast({
        title: "Deleted",
        description: "Campaign removed.",
        variant: "success",
      });
      await refetchCampaigns();
    } catch (error) {
      showToast({
        title: "Error",
        description: error.message,
        variant: "danger",
      });
    }
  };

  const campaigns = Array.isArray(newslettersData?.newsletters)
    ? newslettersData.newsletters
    : Array.isArray(newslettersData?.data)
      ? newslettersData.data
      : Array.isArray(newslettersData)
        ? newslettersData
        : [];
  const subscribers = Array.isArray(subscribersData?.subscribers)
    ? subscribersData.subscribers
    : Array.isArray(subscribersData?.data)
      ? subscribersData.data
      : Array.isArray(subscribersData)
        ? subscribersData
        : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-text">
            Newsletter <span className="text-brand-500">Center</span>
          </h2>
          <p className="text-muted font-bold text-sm tracking-tight">
            Design, send, and track your email marketing campaigns.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(
                activeTab === "campaigns" ? "subscribers" : "campaigns",
              )
            }
            className="rounded-full px-6 uppercase font-black tracking-widest text-xs"
          >
            {activeTab === "campaigns" ? (
              <FaUsers className="mr-2" />
            ) : (
              <FaEnvelope className="mr-2" />
            )}
            {activeTab === "campaigns" ? "Subscribers" : "Campaigns"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTemplateModal(true)}
            className="rounded-full px-6 uppercase font-black tracking-widest text-xs"
          >
            Templates
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="rounded-full px-8 py-6 uppercase font-black tracking-widest italic"
          >
            <FaPlus className="mr-2" /> Create News
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Active Subs",
            value: subscribers.length,
            icon: FaUsers,
            color: "brand",
          },
          {
            label: "Sent news",
            value: campaigns.filter((c) => c.status === "sent").length,
            icon: FaCheckCircle,
            color: "success",
          },
          {
            label: "Drafts",
            value: campaigns.filter((c) => c.status === "draft").length,
            icon: FaClock,
            color: "warning",
          },
          {
            label: "Avg Open Rate",
            value: "24.2%",
            icon: FaChartBar,
            color: "info",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center bg-muted/20",
                  `text-${stat.color}-500`,
                )}
              >
                <stat.icon />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
                <p className="text-xl font-black italic tracking-tighter text-text">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Area */}
      <Card className="bg-surface border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {activeTab === "campaigns" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Campaign
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Status
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Recipients
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Date
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {loadingCampaigns ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="p-8 bg-muted/10" />
                      </tr>
                    ))
                  ) : campaigns.length > 0 ? (
                    campaigns.map((camp) => (
                      <tr
                        key={camp.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4">
                          <p className="font-black uppercase tracking-tight text-text italic">
                            {camp.title}
                          </p>
                          <p className="text-xs text-muted font-bold tracking-tight line-clamp-1">
                            {camp.subject}
                          </p>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              camp.status === "sent" ? "success" : "warning"
                            }
                            className="uppercase font-black text-[10px] tracking-widest"
                          >
                            {camp.status}
                          </Badge>
                        </td>
                        <td className="p-4 font-black italic text-brand-500">
                          {camp.recipient_count || 0}
                        </td>
                        <td className="p-4 text-xs font-bold text-muted uppercase">
                          {new Date(camp.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handleSend(camp)}
                              size="sm"
                              className={cn(
                                "rounded-full px-4 h-8 text-[10px] uppercase font-black italic tracking-widest shadow-lg",
                                camp.status === "sent"
                                  ? "bg-muted text-text hover:bg-muted/80 shadow-muted/20"
                                  : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/20",
                              )}
                            >
                              <FaPaperPlane className="mr-2" />
                              {camp.status === "sent" ? "Resend" : "Send"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(camp);
                                setFormData({
                                  title: camp.title || "",
                                  subject: camp.subject || "",
                                  content: camp.content || "",
                                  status: camp.status || "draft",
                                });
                                setShowModal(true);
                              }}
                              className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCampaign(camp.id)}
                              className="h-8 w-8 p-0 rounded-full hover:bg-rose-500/10 text-rose-500"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-20 text-center font-black italic uppercase text-muted tracking-widest"
                      >
                        No campaigns found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Subscriber
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Status
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted">
                      Date Joined
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {loadingSubscribers ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="p-8 bg-muted/10" />
                      </tr>
                    ))
                  ) : subscribers.length > 0 ? (
                    subscribers.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4">
                          <p className="font-black uppercase tracking-tight text-text italic">
                            {sub.full_name || sub.name || "Anonymous User"}
                          </p>
                          <p className="text-xs text-muted font-bold tracking-tight line-clamp-1">
                            {sub.email}
                          </p>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={sub.is_active ? "success" : "danger"}
                            className="uppercase font-black text-[10px] tracking-widest"
                          >
                            {sub.is_active ? "subscribed" : "unsubscribed"}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs font-bold text-muted uppercase">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusToggle(sub)}
                            className={cn(
                              "h-8 rounded-full px-4 text-[10px] uppercase font-black italic tracking-widest transition-all",
                              sub.is_active
                                ? "hover:bg-rose-500/10 hover:text-rose-500"
                                : "hover:bg-brand-500/10 hover:text-brand-500",
                            )}
                          >
                            {sub.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-20 text-center font-black italic uppercase text-muted tracking-widest"
                      >
                        No subscribers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingItem ? "Edit Newsletter" : "New Campaign"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Internal Title
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Monthly Digest Dec 2024"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                  Email Subject
                </label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="The enticing subject line..."
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-black uppercase tracking-widest text-muted mb-2 block">
                Campaign Content
              </label>
              <div className="flex-1 min-h-[400px] border border-border rounded-lg overflow-hidden flex flex-col bg-background shadow-inner">
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={submitting}
              className="rounded-full px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full px-12 italic font-black uppercase tracking-widest shadow-lg shadow-brand-500/20"
            >
              {submitting
                ? "Processing..."
                : editingItem
                  ? "Update Draft"
                  : "Save Draft"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Templates Modal */}
      <Modal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Newsletter Templates"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templatesData?.templates?.map((tpl) => (
            <Card
              key={tpl.id}
              className="group hover:border-brand-500 transition-all cursor-pointer bg-surface border-border/50"
              onClick={() => handleApplyTemplate(tpl)}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black italic uppercase tracking-tighter text-text group-hover:text-brand-500 transition-colors">
                    {tpl.name}
                  </h4>
                  <Badge
                    variant="subtle"
                    className="text-[10px] font-black uppercase tracking-widest"
                  >
                    {tpl.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {tpl.description || "Draft template for custom campaigns."}
                </p>
                <div className="pt-2 flex justify-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">
                    Apply Template →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Modal>
      {/* Recipient Selection Modal */}
      <Modal
        open={showRecipientModal}
        onClose={() => setShowRecipientModal(false)}
        title="Select Recipients"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100 mb-4">
            <h4 className="text-sm font-bold text-brand-900 mb-1">
              Dispatching: {sendingNewsletter?.title}
            </h4>
            <p className="text-xs text-brand-700/70">
              Select which subscribers should receive this newsletter. Only
              active subscribers are shown.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(true)}
                className="flex-1 md:flex-none h-10 px-4"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(false)}
                className="flex-1 md:flex-none h-10 px-4"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto border rounded-xl divide-y">
            {(subscribersData?.subscribers || [])
              .filter(
                (s) =>
                  s.status === "active" &&
                  (s.email
                    .toLowerCase()
                    .includes(recipientSearch.toLowerCase()) ||
                    s.name
                      .toLowerCase()
                      .includes(recipientSearch.toLowerCase())),
              )
              .map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => toggleSubscriberSelection(sub.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.includes(sub.id)}
                    onChange={() => {}} // Handled by div onClick
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {sub.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {sub.email}
                    </p>
                  </div>
                  {sub.org && (
                    <Badge variant="outline" className="hidden sm:block">
                      {sub.org}
                    </Badge>
                  )}
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground font-medium">
              Selected:{" "}
              <span className="text-brand-600 font-bold">
                {selectedSubscribers.length}
              </span>
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowRecipientModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSend}
                disabled={submitting || selectedSubscribers.length === 0}
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 h-12 shadow-lg shadow-brand-500/30"
              >
                {submitting ? (
                  "Dispatching..."
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Confirm Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
