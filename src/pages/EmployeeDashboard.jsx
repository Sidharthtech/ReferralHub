import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { MY_REFERRALS_QUERY } from '../graphql/queries';
import {
    CREATE_CANDIDATE_MUTATION,
    CREATE_REFERRAL_MUTATION,
} from '../graphql/mutations';

export default function EmployeeDashboard() {
    return (
        <div>
            <div className="page-header">
                <h2>Employee Dashboard</h2>
                <p>Create candidates, submit referrals, and track their status</p>
            </div>

            <div className="card-grid card-grid-2" style={{ marginBottom: '32px' }}>
                <CreateCandidateForm />
                <CreateReferralForm />
            </div>

            <MyReferrals />
        </div>
    );
}

/* ═══════════════════════════════════════
   Create Candidate Form
   ═══════════════════════════════════════ */
function CreateCandidateForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [experienceYears, setExperienceYears] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [createCandidate, { loading }] = useMutation(CREATE_CANDIDATE_MUTATION, {
        onCompleted: (data) => {
            setSuccess(`Candidate "${data.createCandidate.name}" created successfully!`);
            setName('');
            setEmail('');
            setExperienceYears('');
            setError('');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err) => {
            setError(err.message);
            setSuccess('');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || experienceYears === '') {
            setError('All fields are required.');
            return;
        }
        createCandidate({
            variables: {
                name,
                email,
                experienceYears: parseInt(experienceYears, 10),
            },
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>➕ Add Candidate</h3>
            </div>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cand-name">Candidate Name</label>
                    <input
                        id="cand-name"
                        type="text"
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cand-email">Candidate Email</label>
                    <input
                        id="cand-email"
                        type="email"
                        placeholder="jane@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cand-exp">Experience (Years)</label>
                    <input
                        id="cand-exp"
                        type="number"
                        min="0"
                        placeholder="3"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Candidate'}
                </button>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════
   Create Referral Form
   ═══════════════════════════════════════ */
function CreateReferralForm() {
    const [candidateId, setCandidateId] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { data: referralsData } = useQuery(MY_REFERRALS_QUERY);

    const [createReferral, { loading }] = useMutation(CREATE_REFERRAL_MUTATION, {
        refetchQueries: [{ query: MY_REFERRALS_QUERY }],
        onCompleted: (data) => {
            setSuccess(`Referral for "${data.createReferral.candidate.name}" submitted!`);
            setCandidateId('');
            setError('');
            setTimeout(() => setSuccess(''), 4000);
        },
        onError: (err) => {
            setError(err.message);
            setSuccess('');
        },
    });

    // Collect unique candidates from referrals for the dropdown
    const candidates = referralsData?.myReferrals
        ? Array.from(
            new Map(
                referralsData.myReferrals.map((r) => [r.candidate.id, r.candidate])
            ).values()
        )
        : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!candidateId) {
            setError('Please enter a Candidate ID.');
            return;
        }
        createReferral({ variables: { candidateId } });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>🔗 Create Referral</h3>
            </div>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ref-candidate">Candidate ID</label>
                    <input
                        id="ref-candidate"
                        type="text"
                        placeholder="Enter candidate ID"
                        value={candidateId}
                        onChange={(e) => setCandidateId(e.target.value)}
                    />
                </div>

                {candidates.length > 0 && (
                    <div className="form-group">
                        <label>Or select from your candidates</label>
                        <select
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            {candidates.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.email})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading || !candidateId}>
                    {loading ? 'Submitting...' : 'Submit Referral'}
                </button>
            </form>
        </div>
    );
}

/* ═══════════════════════════════════════
   My Referrals List
   ═══════════════════════════════════════ */
function MyReferrals() {
    const { data, loading, error } = useQuery(MY_REFERRALS_QUERY);

    return (
        <div className="card">
            <div className="card-header">
                <h3>📋 My Referrals</h3>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="spinner" />
                    <span className="loading-text">Loading referrals...</span>
                </div>
            )}

            {error && <div className="error-message">{error.message}</div>}

            {data && data.myReferrals.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No referrals yet. Create a candidate and submit a referral to get started!</p>
                </div>
            )}

            {data && data.myReferrals.length > 0 && (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Email</th>
                                <th>Experience</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.myReferrals.map((referral) => (
                                <tr key={referral.id}>
                                    <td>{referral.candidate.name}</td>
                                    <td>{referral.candidate.email}</td>
                                    <td>{referral.candidate.experienceYears} yrs</td>
                                    <td>
                                        <span className={`status-badge ${referral.status.toLowerCase()}`}>
                                            {referral.status === 'PENDING' && '⏳ '}
                                            {referral.status === 'HIRED' && '✅ '}
                                            {referral.status === 'REJECTED' && '❌ '}
                                            {referral.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
