import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ALL_REFERRALS_QUERY } from '../graphql/queries';
import { UPDATE_REFERRAL_STATUS_MUTATION } from '../graphql/mutations';

const STATUS_OPTIONS = ['PENDING', 'HIRED', 'REJECTED'];

export default function HRDashboard() {
    const { data, loading, error } = useQuery(ALL_REFERRALS_QUERY);

    const referrals = data?.allReferrals || [];

    const stats = {
        total: referrals.length,
        pending: referrals.filter(r => r.status === 'PENDING').length,
        hired: referrals.filter(r => r.status === 'HIRED').length,
        rejected: referrals.filter(r => r.status === 'REJECTED').length,
    };

    return (
        <div>
            <div className="page-header">
                <h2>HR Dashboard</h2>
                <p>Manage all referrals and update candidate statuses</p>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon blue">📊</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Referrals</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon amber">⏳</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.hired}</div>
                        <div className="stat-label">Hired</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red">❌</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.rejected}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>
            </div>

            {/* All Referrals */}
            <div className="card">
                <div className="card-header">
                    <h3>📋 All Referrals</h3>
                    <span className="loading-text">{referrals.length} total</span>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner" />
                        <span className="loading-text">Loading referrals...</span>
                    </div>
                )}

                {error && <div className="error-message">{error.message}</div>}

                {!loading && referrals.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>No referrals have been submitted yet.</p>
                    </div>
                )}

                {referrals.length > 0 && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Email</th>
                                    <th>Experience</th>
                                    <th>Referred By</th>
                                    <th>Status</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map((referral) => (
                                    <ReferralRow key={referral.id} referral={referral} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function ReferralRow({ referral }) {
    const [status, setStatus] = useState(referral.status);
    const [feedback, setFeedback] = useState('');

    const [updateStatus, { loading }] = useMutation(UPDATE_REFERRAL_STATUS_MUTATION, {
        refetchQueries: [{ query: ALL_REFERRALS_QUERY }],
        onCompleted: () => {
            setFeedback('Updated!');
            setTimeout(() => setFeedback(''), 2000);
        },
        onError: (err) => {
            setFeedback(`Error: ${err.message}`);
            setStatus(referral.status);
        },
    });

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        updateStatus({
            variables: {
                referralId: referral.id,
                status: newStatus,
            },
        });
    };

    return (
        <tr>
            <td>{referral.candidate.name}</td>
            <td>{referral.candidate.email}</td>
            <td>{referral.candidate.experienceYears} yrs</td>
            <td>{referral.referredBy.name}</td>
            <td>
                <span className={`status-badge ${referral.status.toLowerCase()}`}>
                    {referral.status === 'PENDING' && '⏳ '}
                    {referral.status === 'HIRED' && '✅ '}
                    {referral.status === 'REJECTED' && '❌ '}
                    {referral.status}
                </span>
            </td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                        className="status-select"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={loading}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    {loading && <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />}
                    {feedback && (
                        <span style={{ fontSize: '0.78rem', color: feedback.startsWith('Error') ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                            {feedback}
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
}
