import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Loader } from "../../components/Loader";
import { IconHome, IconMessage, IconStar, IconPlus } from "../../components/Icons";
import { formatPrice } from "../../utils/format";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.get("/properties"), api.get("/contact")])
      .then(([propRes, msgRes]) => {
        if (isMounted) {
          setProperties(propRes.data.properties);
          setMessages(msgRes.data.messages);
        }
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const forSale = properties.filter((p) => p.listingType === "sale").length;
  const forRent = properties.filter((p) => p.listingType === "rent").length;
  const featured = properties.filter((p) => p.featured).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Total Properties", value: properties.length, icon: <IconHome />, color: "bg-brand-500" },
    { label: "For Sale", value: forSale, icon: <IconHome />, color: "bg-blue-500" },
    { label: "For Rent", value: forRent, icon: <IconHome />, color: "bg-purple-500" },
    { label: "Featured", value: featured, icon: <IconStar />, color: "bg-accent-500" },
    { label: "Unread Messages", value: unreadMessages, icon: <IconMessage />, color: "bg-red-500" },
  ];

  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your real estate portal</p>
        </div>
        <Link to="/admin/properties/new" className="btn-primary">
          <IconPlus /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-white ${s.color}`}>
              {s.icon}
            </span>
            <p className="mt-3 text-2xl font-extrabold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Recently Added Properties</h2>
          <Link to="/admin/properties" className="text-sm font-medium text-brand-500 hover:underline">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">City</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-gray-700">{p.title}</td>
                  <td className="py-3 text-gray-500">{p.city}</td>
                  <td className="py-3 capitalize text-gray-500">{p.listingType}</td>
                  <td className="py-3 font-semibold text-brand-600">
                    {formatPrice(p.price, p.listingType)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
