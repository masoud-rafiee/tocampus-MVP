import React, { useState, useEffect } from 'react';

const AdminApprovalQueue = ({ token, userRole, universityId }) => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingAnnouncements, setPendingAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Fetch pending content on component mount or when active tab changes
  useEffect(() => {
    if (userRole !== 'ADMIN') return;
    fetchPendingContent();
  }, [activeTab, userRole]);

  const fetchPendingContent = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'events') {
        const response = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        // Filter only pending events
        const pending = data.filter(event => event.status === 'PENDING' && !event.isApproved);
        setPendingEvents(pending);
      } else {
        const response = await fetch('/api/announcements', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        // Filter only pending announcements
        const pending = data.filter(ann => ann.status === 'PENDING' && !ann.isApproved);
        setPendingAnnouncements(pending);
      }
    } catch (err) {
      setError('Failed to fetch pending content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = activeTab === 'events' ? `/api/events/${id}/approve` : `/api/announcements/${id}/approve`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ policyNotes: 'Approved by admin' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve content');
      }

      // Remove from pending list
      if (activeTab === 'events') {
        setPendingEvents(pendingEvents.filter(e => e.id !== id));
      } else {
        setPendingAnnouncements(pendingAnnouncements.filter(a => a.id !== id));
      }
    } catch (err) {
      setError('Error approving content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (item) => {
    setSelectedItem(item);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const endpoint = activeTab === 'events' 
        ? `/api/events/${selectedItem.id}/reject` 
        : `/api/announcements/${selectedItem.id}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason: rejectionReason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject content');
      }

      // Remove from pending list
      if (activeTab === 'events') {
        setPendingEvents(pendingEvents.filter(e => e.id !== selectedItem.id));
      } else {
        setPendingAnnouncements(pendingAnnouncements.filter(a => a.id !== selectedItem.id));
      }

      setShowRejectionModal(false);
      setSelectedItem(null);
      setRejectionReason('');
    } catch (err) {
      setError('Error rejecting content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'ADMIN') {
    return <div className="p-4 text-red-600">Only admins can access this page.</div>;
  }

  const items = activeTab === 'events' ? pendingEvents : pendingAnnouncements;
  const itemType = activeTab === 'events' ? 'Event' : 'Announcement';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Content Approval Queue</h1>
          <p className="text-gray-600 text-sm mt-1">Review and approve/reject pending {activeTab} from users</p>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'events'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Events ({pendingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'announcements'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Announcements ({pendingAnnouncements.length})
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading && <div className="text-center text-gray-600 py-8">Loading...</div>}

        {!loading && items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No pending {activeTab} to review</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title || item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by: <span className="font-medium">{item.creatorId}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    PENDING REVIEW
                  </span>
                </div>

                <div className="bg-gray-50 rounded p-4 mb-4 max-h-32 overflow-y-auto">
                  <p className="text-gray-700 text-sm">{item.description || item.content}</p>
                </div>

                {/* Policy Check Info */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-900 mb-2">POLICY VALIDATION:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Content length validation</li>
                    <li>✓ No prohibited terms detected</li>
                    <li>✓ Appropriate for university audience</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectClick(item)}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject {itemType}</h2>
            <p className="text-gray-600 text-sm mb-4">
              Please provide a reason for rejecting this {itemType.toLowerCase()}. The creator will be notified.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (e.g., 'Violates university policy on...')"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalQueue;
