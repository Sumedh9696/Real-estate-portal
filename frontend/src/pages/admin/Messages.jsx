import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Loader, EmptyState } from "../../components/Loader";
import { IconMail, IconPhone, IconTrash } from "../../components/Icons";
import { formatDate } from "../../utils/format";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = () => {
    setLoading(true);
    api
      .get("/contact")
      .then(({ data }) => setMessages(data.messages))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading) return <Loader label="Loading messages..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-sm text-gray-500">
          {messages.length} total &middot; {messages.filter((m) => !m.read).length} unread
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          subtitle="Messages sent by interested buyers/tenants through property pages will show up here."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`card p-5 ${!m.read ? "border-l-4 border-l-brand-500" : ""}`}
              onClick={() => !m.read && markAsRead(m.id)}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    {!m.read && (
                      <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Regarding: <span className="font-medium text-gray-700">{m.propertyTitle}</span>
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
                  title="Delete message"
                >
                  <IconTrash />
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <IconMail className="w-3.5 h-3.5 text-brand-500" /> {m.email}
                </span>
                {m.phone && (
                  <span className="flex items-center gap-1.5">
                    <IconPhone className="w-3.5 h-3.5 text-brand-500" /> {m.phone}
                  </span>
                )}
                <span className="ml-auto">{formatDate(m.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
