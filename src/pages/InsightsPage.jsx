import React, { useState } from 'react';
import submissionData from '../../submission.json';
import { BarChart3, ShieldAlert, AlertTriangle, CheckCircle2, FileCode, Search, Database, Layers, ArrowRight, Eye } from 'lucide-react';

export const InsightsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const { answers, findings } = submissionData;

  const categories = ['all', ...new Set(findings.map(f => f.category))];

  const filteredFindings = findings.filter(f => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return f.endpoint.toLowerCase().includes(q) ||
             f.documented.toLowerCase().includes(q) ||
             f.actual.toLowerCase().includes(q) ||
             f.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto 60px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 color="var(--primary)" /> Pune Data Insights & Documentation Findings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Real client-calculated aggregates, data health metrics, and documented API discrepancies with reproducible evidence.
        </p>
      </div>

      {/* Metric Cards Banner (Part 2 Answers Visualized) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL LISTINGS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
            {answers.total_listing_records.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Retrievable from /v1/listings</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>ACTIVE LISTINGS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', marginTop: '4px' }}>
            {answers.active_listings.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>is_live = true records</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>AVG 2BHK PRICE / SQFT</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>
            ₹ {answers.avg_price_per_sqft_2bhk.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Active clean 2BHK listings</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CORRUPT LISTINGS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--danger)', marginTop: '4px' }}>
            {answers.corrupt_listing_ids.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Impossible physical data</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>FAKE / LEAD-GEN LISTINGS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>
            {answers.fake_listing_ids.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Non-genuine listings</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #ec4899' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>MAGARPATTA TOTAL RENT</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ec4899', marginTop: '4px' }}>
            ₹ {(answers.total_monthly_rent / 100000).toFixed(2)} L
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Sum across retrievable rentals</div>
        </div>
      </div>

      {/* Part 3 Findings Section */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode color="var(--primary)" /> API Documentation Discrepancies ({findings.length})
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              Every discrepancy audited between API_REFERENCE.md and actual server behavior with reproduction steps and evidence.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Category Pill Filters */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '0.78rem', textTransform: 'capitalize' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFindings.map((f, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isExpanded ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.2)',
                  border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <code style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700' }}>
                      {f.endpoint}
                    </code>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#d1d5db' }}>
                      {f.category}
                    </span>
                    <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>
                      {f.documented}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
                    {isExpanded ? 'Collapse ▲' : 'View Discrepancy Details ▼'}
                  </span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', fontSize: '0.88rem' }}>
                    <div>
                      <div style={{ color: 'var(--danger)', fontWeight: '700', marginBottom: '4px' }}>Documented Claim:</div>
                      <div style={{ background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                        {f.documented}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>Actual Server Behavior:</div>
                      <div style={{ background: 'rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
                        {f.actual}
                      </div>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '10px' }}>
                        <div>🔍 <strong>How Found:</strong> {f.how_found}</div>
                        <div>⚡ <strong>Impact:</strong> {f.impact}</div>
                      </div>

                      {f.evidence && f.evidence.length > 0 && (
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.82rem' }}>Evidence Identifiers ({f.evidence.length}):</strong>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {f.evidence.map(ev => (
                              <code key={ev} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--accent)' }}>
                                {ev}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
