// BatchOps Enterprise - Simple, Realistic Enterprise Batch Monitoring Web Application
// Built with React 18, Progressive Disclosure Drawers, Role-Based Access, and Chart.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  useNavigate,
  useLocation,
  useParams,
  Routes,
  Route,
  Navigate,
  Link,
  useInRouterContext,
  BrowserRouter
} from 'react-router-dom';
import Chart from 'chart.js/auto';
import './styles.css';


// --- Clean SVG Icons ---
const Icons = {
  Dashboard: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  Jobs: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Map: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Failure: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Alerts: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Scheduler: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Reports: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Users: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Settings: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Play: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Refresh: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Search: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Cross: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ChevronRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Bell: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  LogOut: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ShieldCheck: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  Sun: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Monitor: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Sliders: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  User: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Key: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1 1 2 2-1 1-2-2-1 1 2 2-3 3a5 5 0 1 1-7-7l8-8 2 2 1.5-1.5L21 2z"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Building: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>,
  ArrowLeft: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Camera: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Upload: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Crop: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>,
  RotateCcw: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Printer: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  FileText: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
};

// User Profile Avatar Storage Key (isolated per account email/id)
const getUserAvatarKey = (u) => `stawhats_avatar_${u ? (u.email || u.id || 'default') : 'default'}`;

// Stawhats Brand Logo Mark
const StawhatsLogo = ({ size = 26, isLight = false }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill={isLight ? "#ffffff" : "#0b3334"} />
    <path 
      d="M10 11C10 9.89543 10.8954 9 12 9H19.5C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14H12.5C11.1193 14 10 15.1193 10 16.5C10 17.8807 11.1193 19 12.5 19H20C21.1046 19 22 19.8954 22 21C22 22.1046 21.1046 23 20 23H12C10.8954 23 10 22.1046 10 21" 
      stroke={isLight ? "#0b3334" : "#ffffff"} 
      strokeWidth="2.3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="12" cy="11.5" r="1.1" fill={isLight ? "#0b3334" : "#5eead4"} />
    <circle cx="20" cy="20.5" r="1.1" fill={isLight ? "#0b3334" : "#5eead4"} />
  </svg>
);

// --- Initial Dataset: Realistic Batch Jobs ---
const INITIAL_JOBS = [
  {
    id: "BJ-1092",
    name: "Core Banking Transaction Sync",
    domain: "Financial Settlement",
    schedule: "0 2 * * * (Daily 02:00 UTC)",
    status: "success",
    duration: "24m 18s",
    slaLimit: "30m 00s",
    dependenciesCount: { up: 2, down: 4 },
    lastRun: "2026-09-29 02:24 UTC",
    nextRun: "2026-09-30 02:00 UTC",
    owner: "FinTech SRE",
    records: "12,450,210 rows",
    cluster: "prod-us-east-1",
    worker: "worker-node-01a",
    priority: "Critical",
    slaTier: "Tier 1 Financial",
    failureReason: null
  },
  {
    id: "BJ-1093",
    name: "KYC & Identity Verification Batch",
    domain: "Risk & Compliance",
    schedule: "30 3 * * * (Daily 03:30 UTC)",
    status: "success",
    duration: "18m 05s",
    slaLimit: "25m 00s",
    dependenciesCount: { up: 1, down: 2 },
    lastRun: "2026-09-29 03:48 UTC",
    nextRun: "2026-09-30 03:30 UTC",
    owner: "Compliance Team",
    records: "842,100 records",
    cluster: "prod-us-east-1",
    worker: "worker-node-02b",
    priority: "High",
    slaTier: "Tier 2 Analytics",
    failureReason: null
  },
  {
    id: "BJ-1094",
    name: "Nightly General Ledger Reconciliation",
    domain: "Financial Settlement",
    schedule: "0 4 * * * (Daily 04:00 UTC)",
    status: "failed",
    duration: "28m 01s",
    slaLimit: "35m 00s",
    dependenciesCount: { up: 3, down: 4 },
    lastRun: "2026-09-29 04:28 UTC",
    nextRun: "Manual Retry Pending",
    owner: "Ledger Platform Team",
    records: "4,821,900 rows",
    cluster: "prod-us-east-1",
    worker: "worker-node-04c",
    priority: "Critical",
    slaTier: "Tier 1 Financial",
    failureReason: "PostgreSQL Deadlock detected on table 'gl_daily_balance' during concurrent upsert."
  },
  {
    id: "BJ-1095",
    name: "Fraud Detection Realtime Scoring",
    domain: "Risk & Compliance",
    schedule: "*/15 * * * * (Every 15m)",
    status: "running",
    duration: "08m 12s",
    slaLimit: "12m 00s",
    dependenciesCount: { up: 2, down: 3 },
    lastRun: "2026-09-29 17:45 UTC",
    nextRun: "2026-09-29 18:00 UTC",
    owner: "Risk Analytics",
    records: "3,140,000 events",
    cluster: "prod-us-east-1",
    worker: "worker-node-gpu-02",
    priority: "Critical",
    slaTier: "Tier 1 Financial",
    failureReason: null
  },
  {
    id: "BJ-1096",
    name: "Delta Lake Ingestion & Parquet Compaction",
    domain: "Data Platform",
    schedule: "0 */2 * * * (Every 2 Hours)",
    status: "running",
    duration: "14m 45s",
    slaLimit: "20m 00s",
    dependenciesCount: { up: 1, down: 5 },
    lastRun: "2026-09-29 16:00 UTC",
    nextRun: "2026-09-29 18:00 UTC",
    owner: "Data Engineering",
    records: "28,900,400 rows",
    cluster: "prod-us-east-1",
    worker: "worker-node-08f",
    priority: "High",
    slaTier: "Tier 2 Analytics",
    failureReason: null
  },
  {
    id: "BJ-1097",
    name: "Regulatory Basel-III Compliance Report",
    domain: "Risk & Compliance",
    schedule: "0 6 * * * (Daily 06:00 UTC)",
    status: "delayed",
    duration: "52m 40s",
    slaLimit: "45m 00s",
    dependenciesCount: { up: 4, down: 2 },
    lastRun: "2026-09-29 06:52 UTC",
    nextRun: "2026-09-30 06:00 UTC",
    owner: "Regulatory Ops",
    records: "1,200,800 records",
    cluster: "prod-us-east-1",
    worker: "worker-node-03a",
    priority: "Critical",
    slaTier: "Tier 1 Financial",
    failureReason: "Upstream GL data reconciliation was delayed (+24m lag)"
  },
  {
    id: "BJ-1098",
    name: "Customer Statement Email Dispatcher",
    domain: "Customer 360",
    schedule: "0 7 * * * (Daily 07:00 UTC)",
    status: "success",
    duration: "31m 10s",
    slaLimit: "40m 00s",
    dependenciesCount: { up: 3, down: 1 },
    lastRun: "2026-09-29 07:31 UTC",
    nextRun: "2026-09-30 07:00 UTC",
    owner: "Messaging Services",
    records: "450,000 emails",
    cluster: "prod-us-east-1",
    worker: "worker-node-11a",
    priority: "Medium",
    slaTier: "Tier 3 Internal",
    failureReason: null
  },
  {
    id: "BJ-1099",
    name: "Global Warehouse Inventory Snapshot",
    domain: "Supply Chain",
    schedule: "0 1 * * * (Daily 01:00 UTC)",
    status: "failed",
    duration: "11m 30s",
    slaLimit: "25m 00s",
    dependenciesCount: { up: 1, down: 3 },
    lastRun: "2026-09-29 01:11 UTC",
    nextRun: "Manual Retry Pending",
    owner: "Supply Chain Analytics",
    records: "6,700,000 SKUs",
    cluster: "prod-eu-west-1",
    worker: "worker-node-eu-02",
    priority: "High",
    slaTier: "Tier 2 Analytics",
    failureReason: "Schema mismatch in incoming CSV partition: column 'warehouse_zone_id' missing."
  },
  {
    id: "BJ-1101",
    name: "Executive Daily P&L Dashboard Aggregator",
    domain: "Financial Settlement",
    schedule: "30 7 * * * (Daily 07:30 UTC)",
    status: "delayed",
    duration: "38m 12s",
    slaLimit: "30m 00s",
    dependenciesCount: { up: 4, down: 0 },
    lastRun: "2026-09-29 08:08 UTC",
    nextRun: "2026-09-30 07:30 UTC",
    owner: "Finance BI",
    records: "920,000 metrics",
    cluster: "prod-us-east-1",
    worker: "worker-node-07e",
    priority: "Critical",
    slaTier: "Tier 1 Financial",
    failureReason: "Upstream GL Reconciliation deadlock blocked primary ledger rollups."
  }
];

// --- Initial Alerts List with Active State ---
const INITIAL_ALERTS = [
  {
    id: "ALT-801",
    severity: "Critical",
    title: "PostgreSQL Deadlock Detected",
    jobId: "BJ-1094",
    jobName: "Nightly General Ledger Reconciliation",
    reason: "Process 4812 waits for ExclusiveLock on 'gl_daily_balance'. Blocked 4 downstream workflows.",
    time: "14m ago",
    status: "active", // 'active', 'acknowledged', 'resolved'
    recommendedAction: "Apply SERIALIZABLE transaction isolation and retry with exponential jitter backoff."
  },
  {
    id: "ALT-802",
    severity: "Warning",
    title: "SLA Threshold Exceeded (+14m delay)",
    jobId: "BJ-1097",
    jobName: "Regulatory Basel-III Compliance Report",
    reason: "Execution time reached 52m (Max SLA 45m). Blocked by upstream GL lag.",
    time: "42m ago",
    status: "active",
    recommendedAction: "Pre-allocate high-priority compute partition on worker-node-03a."
  },
  {
    id: "ALT-803",
    severity: "Critical",
    title: "Schema Mismatch / Column Missing",
    jobId: "BJ-1099",
    jobName: "Global Warehouse Inventory Snapshot",
    reason: "Column 'warehouse_zone_id' missing from partition file 'inv_part_20260929.csv'.",
    time: "2h ago",
    status: "active",
    recommendedAction: "Reroute malformed partition to quarantine storage and continue core ingestion."
  },
  {
    id: "ALT-804",
    severity: "Warning",
    title: "Predicted Volume Surge on Ingress Stream",
    jobId: "BJ-1092",
    jobName: "Core Banking Transaction Sync",
    reason: "Kafka topic cust.events.v2 surge +380% vs baseline. +54m delay predicted.",
    time: "1h ago",
    status: "active",
    recommendedAction: "Scale worker node executor count from 8 to 20 containers."
  }
];

// --- Initial Users List for Admin ---
const INITIAL_USERS = [
  { id: "USR-01", name: "Sarah Vance", email: "admin@stawhats.enterprise", role: "admin", department: "Data Infrastructure", status: "Active", lastLogin: "Just Now", avatarColor: "#0b3334" },
  { id: "USR-02", name: "Alex Chen", email: "operator@stawhats.enterprise", role: "user", department: "Platform Operations", status: "Active", lastLogin: "10m ago", avatarColor: "#1d4ed8" },
  { id: "USR-03", name: "Marcus Reed", email: "m.reed@stawhats.enterprise", role: "user", department: "Risk & Compliance", status: "Active", lastLogin: "2h ago", avatarColor: "#047857" },
  { id: "USR-04", name: "Elena Rostova", email: "e.rostova@stawhats.enterprise", role: "user", department: "Financial Platform", status: "Disabled", lastLogin: "3 days ago", avatarColor: "#b45309" }
];

// --- Simple Workflow DAG ---
const INITIAL_DAG = {
  nodes: [
    { id: "node-1", jobId: "BJ-1091", label: "Data Ingestion (S3 / Kafka)", stage: "Ingestion", status: "success", x: 40, y: 140, duration: "12m 10s", records: "18.4M" },
    { id: "node-2", jobId: "BJ-1093", label: "Schema Validation Gate", stage: "Validation", status: "success", x: 260, y: 140, duration: "8m 45s", records: "18.2M" },
    { id: "node-3", jobId: "BJ-1094", label: "Customer Load & Reconcile", stage: "Transformation", status: "failed", x: 480, y: 140, duration: "28m 01s", records: "4.8M" },
    { id: "node-4", jobId: "BJ-1101", label: "Report Gen (Daily P&L)", stage: "Reporting", status: "delayed", x: 700, y: 140, duration: "38m 12s", records: "920K" },
    { id: "node-5", jobId: "BJ-1098", label: "Email & SFTP Delivery", stage: "Egress", status: "queued", x: 920, y: 140, duration: "Pending", records: "--" }
  ],
  edges: [
    { from: "node-1", to: "node-2", label: "Raw JSON" },
    { from: "node-2", to: "node-3", label: "Clean Parquet" },
    { from: "node-3", to: "node-4", label: "GL Aggregates" },
    { from: "node-4", to: "node-5", label: "PDF Reports" }
  ]
};

// --- Execution Logs Sample ---
const JOB_LOGS_SAMPLE = [
  { time: "04:00:02 UTC", level: "INFO", msg: "Batch Worker worker-node-04c assigned to job BJ-1094 (RunID #948210)" },
  { time: "04:00:05 UTC", level: "INFO", msg: "Cluster environment: prod-us-east-1 | Driver RAM: 16GB | Cores: 8" },
  { time: "04:01:25 UTC", level: "INFO", msg: "Stage 1/5: Partition Discovery completed in 1m 20s. 48 S3 partitions located." },
  { time: "04:05:37 UTC", level: "INFO", msg: "Stage 2/5: Parquet Schema Validation completed in 4m 12s. 0 anomalies." },
  { time: "04:14:22 UTC", level: "INFO", msg: "Stage 3/5: Currency Conversion Matrix calculated across 34 FX pairs." },
  { time: "04:20:00 UTC", level: "INFO", msg: "Stage 4/5: Beginning GL Ledger Cross-Reconciliation on database 'db_fin_ledger'..." },
  { time: "04:26:45 UTC", level: "WARN", msg: "Lock acquisition delay on relation 'gl_daily_balance'. Waiting for lock holder (PID 4812)..." },
  { time: "04:27:58 UTC", level: "ERROR", msg: "FATAL: Deadlock detected in PostgreSQL transaction TX-849102." },
  { time: "04:28:01 UTC", level: "ERROR", msg: "Process 4812 waits for ExclusiveLock on 'gl_daily_balance'; blocked by Process 9924." },
  { time: "04:28:01 UTC", level: "ERROR", msg: "Task 'reconcile_gl_partitions' failed with exit code 143. Retries remaining: 0/3." },
  { time: "04:28:02 UTC", level: "WARN", msg: "Stage 5/5: Downstream Snapshot Push BLOCKED due to upstream failure." },
  { time: "04:28:03 UTC", level: "INFO", msg: "Incident INC-8492 filed to PagerDuty service: #fintech-sre." }
];

// =========================================================================
// ROOT APP COMPONENT (WITH AUTHENTICATION & PROGRESSIVE DISCLOSURE)
// =========================================================================
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State (defaults to null to display Stawhats login page)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("stawhats_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const photo = localStorage.getItem(getUserAvatarKey(parsed));
        return { ...parsed, avatarUrl: photo || parsed.avatarUrl || null };
      }
    } catch (e) {}
    return null;
  });

  // Synchronize avatar picture when switching between Admin and User accounts
  useEffect(() => {
    if (currentUser) {
      try {
        const photo = localStorage.getItem(getUserAvatarKey(currentUser));
        if (photo !== currentUser.avatarUrl) {
          setCurrentUser(prev => prev ? { ...prev, avatarUrl: photo || null } : prev);
        }
      } catch (e) {}
    }
  }, [currentUser?.email]);

  // Global Brand / Application Name State (Persisted, Admin editable)
  const [appName, setAppName] = useState(() => {
    try {
      return localStorage.getItem("stawhats_app_name") || "Stawhats";
    } catch (e) {
      return "Stawhats";
    }
  });

  const handleSaveAppName = (newName) => {
    const trimmed = (newName || "").trim();
    if (!trimmed) {
      showToast("error", "Application name cannot be empty.");
      return;
    }
    try {
      localStorage.setItem("stawhats_app_name", trimmed);
    } catch (e) {}
    setAppName(trimmed);
    showToast("success", `Application name updated to "${trimmed}".`);
  };

  // Enterprise Dynamic Page Titles & Route Synchronization
  useEffect(() => {
    const path = location.pathname;
    let title = `${appName} — Dashboard`;
    if (path === '/jobs') {
      title = `${appName} — Job Monitoring`;
    } else if (path.startsWith('/jobs/')) {
      const jobId = path.split('/')[2];
      title = `${appName} — Job Details: ${jobId || ''}`;
    } else if (path === '/dependencies' || path === '/map') {
      title = `${appName} — Dependency Map`;
    } else if (path === '/alerts') {
      title = `${appName} — Alerts`;
    } else if (path.startsWith('/alerts/')) {
      const alertId = path.split('/')[2];
      title = `${appName} — Alert Details: ${alertId || ''}`;
    } else if (path === '/scheduler') {
      title = `${appName} — Scheduler`;
    } else if (path === '/reports') {
      title = `${appName} — Reports & SLAs`;
    } else if (path.startsWith('/settings')) {
      title = `${appName} — Settings`;
    } else if (path === '/admin/users') {
      title = `${appName} — User Management`;
    } else if (path === '/admin/branding') {
      title = `${appName} — Brand Settings`;
    } else if (path === '/admin/jobs') {
      title = `${appName} — Job Management`;
    } else if (path === '/login') {
      title = `${appName} — Enterprise Login`;
    }
    document.title = title;
  }, [appName, location.pathname]);

  // User-Specific Theme State (Light, Dark, System Default)
  const getUserThemeKey = (u) => `stawhats_theme_${u ? u.email : 'default'}`;

  const [theme, setTheme] = useState(() => {
    try {
      const savedUser = localStorage.getItem("stawhats_user");
      const u = savedUser ? JSON.parse(savedUser) : null;
      return localStorage.getItem(getUserThemeKey(u)) || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    if (currentUser) {
      try {
        const saved = localStorage.getItem(getUserThemeKey(currentUser)) || "light";
        setTheme(saved);
      } catch (e) {
        setTheme("light");
      }
    }
  }, [currentUser]);

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    if (currentUser) {
      try {
        localStorage.setItem(getUserThemeKey(currentUser), newTheme);
      } catch (e) {}
    }
    showToast("info", `Theme set to ${newTheme === 'system' ? 'System Default' : newTheme.toUpperCase()}`);
  };

  // Immediate theme application to documentElement
  useEffect(() => {
    const apply = (t) => {
      let active = t;
      if (t === 'system') {
        active = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', active);
    };

    apply(theme);

    if (theme === 'system' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  // User-Specific Preferences State
  const getUserPrefsKey = (u) => `stawhats_prefs_${u ? u.email : 'default'}`;

  const DEFAULT_PREFS = {
    emailNotifications: true,
    jobFailureAlerts: true,
    predictiveAlerts: true,
    dashboardDensity: "comfortable",
    defaultLandingPage: "dashboard",
    language: "en"
  };

  const [preferences, setPreferences] = useState(() => {
    try {
      const savedUser = localStorage.getItem("stawhats_user");
      const u = savedUser ? JSON.parse(savedUser) : null;
      const saved = localStorage.getItem(getUserPrefsKey(u));
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch (e) {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    if (currentUser) {
      try {
        const saved = localStorage.getItem(getUserPrefsKey(currentUser));
        if (saved) {
          setPreferences({ ...DEFAULT_PREFS, ...JSON.parse(saved) });
          return;
        }
      } catch (e) {}
    }
    setPreferences(DEFAULT_PREFS);
  }, [currentUser]);

  const handleSavePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    if (currentUser) {
      try {
        localStorage.setItem(getUserPrefsKey(currentUser), JSON.stringify(newPrefs));
      } catch (e) {}
    }
    showToast("success", "Preferences saved successfully.");
  };

  // Settings Active Tab State
  const [settingsTab, setSettingsTab] = useState("appearance");

  // Users State (Persisted)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("stawhats_users");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USERS;
  });

  const handleUpdateUsers = (newUsers) => {
    setUsers(newUsers);
    try {
      localStorage.setItem("stawhats_users", JSON.stringify(newUsers));
    } catch (e) {}
  };

  // Save Profile Handler
  const handleSaveProfile = ({ name, email, avatarColor, newPassword }) => {
    if (!name.trim() || !email.trim()) {
      showToast("error", "Name and email cannot be empty.");
      return false;
    }

    const currentPhoto = localStorage.getItem(getUserAvatarKey(currentUser));

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      avatarColor: avatarColor || currentUser.avatarColor || "#0b3334",
      avatarUrl: currentPhoto || currentUser.avatarUrl || null
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem("stawhats_user", JSON.stringify(updatedUser));
    } catch (e) {}

    // Update in users list
    handleUpdateUsers(users.map(u => (u.id === currentUser.id || u.email === currentUser.email) ? { ...u, name: name.trim(), email: email.trim(), avatarColor, avatarUrl: currentPhoto || u.avatarUrl || null } : u));

    if (newPassword && newPassword.trim()) {
      showToast("success", "Profile details and password updated successfully.");
    } else {
      showToast("success", "Profile details updated successfully.");
    }
    return true;
  };

  // Save or Remove Profile Photo Handler (Isolated per authenticated user account)
  const handleSaveProfilePhoto = (photoDataUrl) => {
    if (!currentUser) return;
    try {
      const key = getUserAvatarKey(currentUser);
      if (photoDataUrl) {
        localStorage.setItem(key, photoDataUrl);
      } else {
        localStorage.removeItem(key);
      }

      const updatedUser = {
        ...currentUser,
        avatarUrl: photoDataUrl || null
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("stawhats_user", JSON.stringify(updatedUser));

      // Also update in users registry if present
      handleUpdateUsers(users.map(u => (u.id === currentUser.id || u.email === currentUser.email) ? { ...u, avatarUrl: photoDataUrl || null } : u));

      showToast("success", photoDataUrl ? "Profile picture saved successfully." : "Profile picture removed.");
    } catch (err) {
      showToast("error", "Could not save profile photo to storage.");
    }
  };

  // Navigation State
  const [activePage, setActivePage] = useState("dashboard");
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [dag, setDag] = useState(INITIAL_DAG);

  // Progressive Disclosure: Drawer State
  const [drawer, setDrawer] = useState({
    open: false,
    type: null, // 'job' | 'alert' | 'schedule'
    data: null
  });

  // Modals & Feedback
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Drawer & Dedicated Route Navigation Helpers
  const openJobDrawer = (job) => {
    if (job && job.id) {
      navigate(`/jobs/${job.id}`);
    } else {
      setDrawer({ open: true, type: 'job', data: job });
    }
  };

  const openAlertDrawer = (alert) => {
    if (alert && alert.id) {
      navigate(`/alerts/${alert.id}`);
    } else {
      setDrawer({ open: true, type: 'alert', data: alert });
    }
  };

  const closeDrawer = () => {
    setDrawer({ open: false, type: null, data: null });
  };

  // Job Actions
  const handleTriggerRun = (jobId) => {
    showToast("info", `Triggering execution for ${jobId}...`);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "running", duration: "00m 02s" } : j));
    if (drawer.data && drawer.data.id === jobId) {
      setDrawer(prev => ({ ...prev, data: { ...prev.data, status: "running" } }));
    }

    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "success", duration: "21m 15s", lastRun: "Just Now" } : j));
      if (drawer.data && drawer.data.id === jobId) {
        setDrawer(prev => ({ ...prev, data: { ...prev.data, status: "success" } }));
      }
      showToast("success", `Job ${jobId} finished successfully.`);
    }, 3000);
  };

  const handleRetryJob = (jobId) => {
    showToast("info", `Retrying failed job ${jobId}...`);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "running", failureReason: null } : j));
    if (drawer.data && drawer.data.id === jobId) {
      setDrawer(prev => ({ ...prev, data: { ...prev.data, status: "running", failureReason: null } }));
    }

    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "success", duration: "27m 40s", lastRun: "Just Now (Recovered)" } : j));
      if (drawer.data && drawer.data.id === jobId) {
        setDrawer(prev => ({ ...prev, data: { ...prev.data, status: "success" } }));
      }
      showToast("success", `Job ${jobId} recovered with 0 errors.`);
    }, 3000);
  };

  // Alert Actions (Acknowledge / Resolve)
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "acknowledged" } : a));
    if (drawer.data && drawer.data.id === alertId) {
      setDrawer(prev => ({ ...prev, data: { ...prev.data, status: "acknowledged" } }));
    }
    showToast("info", `Alert ${alertId} acknowledged.`);
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "resolved" } : a));
    if (drawer.data && drawer.data.id === alertId) {
      setDrawer(prev => ({ ...prev, data: { ...prev.data, status: "resolved" } }));
    }
    showToast("success", `Alert ${alertId} marked as resolved.`);
  };

  // Admin: Delete Job
  const handleDeleteJob = (jobId) => {
    if (confirm(`Are you sure you want to delete batch job ${jobId}?`)) {
      setJobs(prev => prev.filter(j => j.id !== jobId));
      if (drawer.open) closeDrawer();
      showToast("info", `Job ${jobId} removed from registry.`);
    }
  };

  // Protected Route & Authentication Handler
  if (!currentUser) {
    return (
      <Routes>
        <Route 
          path="/login" 
          element={
            <LoginPage 
              appName={appName}
              onLogin={(user) => {
                const photo = localStorage.getItem(getUserAvatarKey(user));
                const fullUser = { ...user, avatarUrl: photo || null };
                setCurrentUser(fullUser);
                try {
                  localStorage.setItem("stawhats_user", JSON.stringify(fullUser));
                  const savedPrefs = localStorage.getItem(`stawhats_prefs_${user.email}`);
                  let target = '/dashboard';
                  if (savedPrefs) {
                    const parsed = JSON.parse(savedPrefs);
                    if (parsed.defaultLandingPage) {
                      target = parsed.defaultLandingPage.startsWith('/') ? parsed.defaultLandingPage : `/${parsed.defaultLandingPage}`;
                    }
                  }
                  const redirectPath = location.state?.from?.pathname || target;
                  navigate(redirectPath === '/login' ? '/dashboard' : redirectPath, { replace: true });
                } catch (e) {
                  navigate('/dashboard', { replace: true });
                }
                showToast("success", `Signed in as ${user.name} (${user.role.toUpperCase()})`);
              }}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/login" state={{ from: location }} replace />} />
      </Routes>
    );
  }

  const activeAlertCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className={`app-layout ${preferences.dashboardDensity === 'compact' ? 'compact-density' : ''}`}>
      {/* 1. Sidebar Navigation */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-badge" onClick={() => navigate("/dashboard")}>
            <div className="brand-logo-icon" style={{ background: '#0b3334' }}>
              <StawhatsLogo size={22} isLight={true} />
            </div>
            {!sidebarCollapsed && (
              <div className="brand-text">
                <h1>{appName}</h1>
                <p>Enterprise</p>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Sidebar"
          >
            <Icons.ChevronRight />
          </button>
        </div>

        <nav className="nav-menu">
          {!sidebarCollapsed && <div className="nav-section-title">Monitoring</div>}
          
          <div 
            className={`nav-item ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-icon"><Icons.Dashboard /></span>
            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
          </div>

          <div 
            className={`nav-item ${location.pathname.startsWith('/jobs') ? 'active' : ''}`}
            onClick={() => navigate('/jobs')}
          >
            <span className="nav-icon"><Icons.Jobs /></span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Job Monitoring</span>
                <span className="nav-badge running">2</span>
              </>
            )}
          </div>

          <div 
            className={`nav-item ${location.pathname === '/dependencies' || location.pathname === '/map' ? 'active' : ''}`}
            onClick={() => navigate('/dependencies')}
          >
            <span className="nav-icon"><Icons.Map /></span>
            {!sidebarCollapsed && <span className="nav-label">Dependency Map</span>}
          </div>

          <div 
            className={`nav-item ${location.pathname.startsWith('/alerts') ? 'active' : ''}`}
            onClick={() => navigate('/alerts')}
          >
            <span className="nav-icon"><Icons.Alerts /></span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">Alerts</span>
                {activeAlertCount > 0 && <span className="nav-badge danger">{activeAlertCount}</span>}
              </>
            )}
          </div>

          <div 
            className={`nav-item ${location.pathname === '/scheduler' ? 'active' : ''}`}
            onClick={() => navigate('/scheduler')}
          >
            <span className="nav-icon"><Icons.Scheduler /></span>
            {!sidebarCollapsed && <span className="nav-label">Scheduler</span>}
          </div>

          <div 
            className={`nav-item ${location.pathname === '/reports' ? 'active' : ''}`}
            onClick={() => navigate('/reports')}
          >
            <span className="nav-icon"><Icons.Reports /></span>
            {!sidebarCollapsed && <span className="nav-label">Reports & SLAs</span>}
          </div>

          {/* Settings Navigation (BOTH Admin and User) */}
          <div 
            className={`nav-item ${location.pathname === '/settings' || location.pathname.startsWith('/settings/appearance') || location.pathname.startsWith('/settings/preferences') || location.pathname.startsWith('/settings/profile') ? 'active' : ''}`}
            onClick={() => {
              navigate('/settings');
              setSettingsTab('appearance');
            }}
          >
            <span className="nav-icon"><Icons.Settings /></span>
            {!sidebarCollapsed && <span className="nav-label">Settings</span>}
          </div>

          {/* Admin-Only Navigation */}
          {currentUser.role === 'admin' && (
            <>
              {!sidebarCollapsed && <div className="nav-section-title">Administration</div>}
              
              <div 
                className={`nav-item ${location.pathname === '/admin/jobs' ? 'active' : ''}`}
                onClick={() => navigate('/admin/jobs')}
              >
                <span className="nav-icon"><Icons.Jobs /></span>
                {!sidebarCollapsed && <span className="nav-label">Job Management</span>}
              </div>

              <div 
                className={`nav-item ${location.pathname === '/admin/users' || location.pathname === '/settings/users' ? 'active' : ''}`}
                onClick={() => {
                  navigate('/admin/users');
                  setSettingsTab('users');
                }}
              >
                <span className="nav-icon"><Icons.Users /></span>
                {!sidebarCollapsed && <span className="nav-label">User Management</span>}
              </div>

              <div 
                className={`nav-item ${location.pathname === '/admin/branding' || location.pathname === '/settings/brand' ? 'active' : ''}`}
                onClick={() => {
                  navigate('/admin/branding');
                  setSettingsTab('brand');
                }}
              >
                <span className="nav-icon"><Icons.Building /></span>
                {!sidebarCollapsed && <span className="nav-label">Brand & System</span>}
              </div>
            </>
          )}
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="cluster-health-mini">
              <div className="health-row">
                <span style={{ color: '#64748b' }}>Cluster Workers</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>24 / 24 Online</span>
              </div>
              <div className="health-row">
                <span style={{ color: '#64748b' }}>Overall SLA</span>
                <span style={{ color: '#15803d', fontWeight: 600 }}>99.98%</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* 2. Top Navigation Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="search-box">
              <span className="search-icon"><Icons.Search /></span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search batch jobs, workflows, or IDs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-shortcut">/</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Environment Badge */}
            <div className="health-chip">
              <span className="health-status-dot green"></span>
              <span>US-East-1 Production</span>
            </div>

            {/* Quick Trigger Button (Admin only) */}
            {currentUser.role === 'admin' && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setScheduleModalOpen(true)}
              >
                + Schedule Job
              </button>
            )}

            {/* Notification Bell */}
            <div 
              className={`btn-icon-top ${location.pathname.startsWith('/alerts') ? 'active' : ''}`} 
              onClick={() => navigate('/alerts')}
              title="Alerts"
            >
              <Icons.Bell />
              {activeAlertCount > 0 && <span className="notification-badge-dot"></span>}
            </div>

            {/* Settings Quick Access Button */}
            <div 
              className={`btn-icon-top ${location.pathname.startsWith('/settings') ? 'active' : ''}`}
              onClick={() => {
                navigate('/settings');
                setSettingsTab('appearance');
              }}
              title="Settings"
            >
              <Icons.Settings />
            </div>

            {/* User Profile & Sign Out */}
            <div 
              className="user-profile-btn" 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => {
                navigate('/settings/profile');
                setSettingsTab('profile');
              }}
              title="Profile Settings"
            >
              <div 
                className="user-avatar"
                style={{ 
                  backgroundColor: currentUser.avatarUrl ? 'transparent' : (currentUser.avatarColor || '#0b3334'),
                  overflow: 'hidden'
                }}
              >
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="user-avatar-img"
                  />
                ) : (
                  currentUser.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>{currentUser.name}</div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className={`role-tag ${currentUser.role}`}>{currentUser.role}</span>
                </div>
              </div>
              <button 
                className="action-btn-mini" 
                style={{ marginLeft: 6 }}
                onClick={(e) => {
                  e.stopPropagation();
                  try { localStorage.removeItem("stawhats_user"); } catch (err) {}
                  setCurrentUser(null);
                  navigate('/login');
                }}
                title="Sign Out"
              >
                <Icons.LogOut />
              </button>
            </div>
          </div>
        </header>

        {/* 3. Main Views (Enterprise Client-Side Routing) */}
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <DashboardView 
                  jobs={jobs} 
                  alerts={alerts}
                  onOpenJob={openJobDrawer}
                  onOpenAlert={openAlertDrawer}
                  onNavigate={(target) => navigate(target.startsWith('/') ? target : `/${target}`)}
                />
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <JobMonitoringView 
                  jobs={jobs} 
                  onOpenJob={openJobDrawer}
                  onTriggerRun={handleTriggerRun}
                  isAdmin={currentUser.role === 'admin'}
                  onNewJob={() => setScheduleModalOpen(true)}
                />
              } 
            />
            <Route 
              path="/jobs/:id" 
              element={
                <JobDetailPage 
                  jobs={jobs} 
                  onRun={handleTriggerRun} 
                  onRetry={handleRetryJob} 
                  isAdmin={currentUser.role === 'admin'} 
                />
              } 
            />
            <Route 
              path="/dependencies" 
              element={
                <DependencyMapView 
                  dag={dag} 
                  onOpenJobById={(jobId) => {
                    navigate(`/jobs/${jobId}`);
                  }}
                />
              } 
            />
            <Route 
              path="/map" 
              element={<Navigate to="/dependencies" replace />} 
            />
            <Route 
              path="/alerts" 
              element={
                <AlertsView 
                  alerts={alerts} 
                  onOpenAlert={openAlertDrawer}
                  onAcknowledge={handleAcknowledgeAlert}
                  onResolve={handleResolveAlert}
                />
              } 
            />
            <Route 
              path="/alerts/:id" 
              element={
                <AlertDetailPage 
                  alerts={alerts} 
                  onAcknowledge={handleAcknowledgeAlert} 
                  onResolve={handleResolveAlert} 
                />
              } 
            />
            <Route 
              path="/scheduler" 
              element={
                <SchedulerView 
                  jobs={jobs} 
                  onOpenJob={openJobDrawer}
                  isAdmin={currentUser.role === 'admin'}
                  onNewJob={() => setScheduleModalOpen(true)}
                />
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ReportsView 
                  jobs={jobs} 
                  dag={dag} 
                  alerts={alerts} 
                  currentUser={currentUser} 
                  onOpenJob={openJobDrawer}
                  showToast={showToast} 
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <SettingsView 
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  appName={appName}
                  onSaveAppName={handleSaveAppName}
                  theme={theme}
                  onSetTheme={handleSetTheme}
                  preferences={preferences}
                  onSavePreferences={handleSavePreferences}
                  onSaveProfile={handleSaveProfile}
                  onSaveProfilePhoto={handleSaveProfilePhoto}
                  users={users}
                  onUpdateUsers={handleUpdateUsers}
                  activeTab="appearance"
                  setActiveTab={setSettingsTab}
                  showToast={showToast}
                />
              } 
            />
            <Route 
              path="/settings/:tab" 
              element={
                <SettingsTabRouteWrapper 
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  appName={appName}
                  onSaveAppName={handleSaveAppName}
                  theme={theme}
                  onSetTheme={handleSetTheme}
                  preferences={preferences}
                  onSavePreferences={handleSavePreferences}
                  onSaveProfile={handleSaveProfile}
                  onSaveProfilePhoto={handleSaveProfilePhoto}
                  users={users}
                  onUpdateUsers={handleUpdateUsers}
                  setActiveTab={setSettingsTab}
                  showToast={showToast}
                />
              } 
            />
            <Route 
              path="/admin/jobs" 
              element={
                currentUser.role === 'admin' ? (
                  <AdminJobManagementView 
                    jobs={jobs} 
                    onOpenJob={openJobDrawer}
                    onDeleteJob={handleDeleteJob}
                    onNewJob={() => setScheduleModalOpen(true)}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                currentUser.role === 'admin' ? (
                  <SettingsView 
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    appName={appName}
                    onSaveAppName={handleSaveAppName}
                    theme={theme}
                    onSetTheme={handleSetTheme}
                    preferences={preferences}
                    onSavePreferences={handleSavePreferences}
                    onSaveProfile={handleSaveProfile}
                    onSaveProfilePhoto={handleSaveProfilePhoto}
                    users={users}
                    onUpdateUsers={handleUpdateUsers}
                    activeTab="users"
                    setActiveTab={setSettingsTab}
                    showToast={showToast}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            <Route 
              path="/admin/branding" 
              element={
                currentUser.role === 'admin' ? (
                  <SettingsView 
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    appName={appName}
                    onSaveAppName={handleSaveAppName}
                    theme={theme}
                    onSetTheme={handleSetTheme}
                    preferences={preferences}
                    onSavePreferences={handleSavePreferences}
                    onSaveProfile={handleSaveProfile}
                    onSaveProfilePhoto={handleSaveProfilePhoto}
                    users={users}
                    onUpdateUsers={handleUpdateUsers}
                    activeTab="brand"
                    setActiveTab={setSettingsTab}
                    showToast={showToast}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              } 
            />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* 4. Progressive Disclosure: Slide-Over Detail Drawer */}
      {drawer.open && (
        <div className="drawer-backdrop" onClick={closeDrawer}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            {drawer.type === 'job' && drawer.data && (
              <JobDetailDrawerContent 
                job={drawer.data}
                onClose={closeDrawer}
                onRun={handleTriggerRun}
                onRetry={handleRetryJob}
                isAdmin={currentUser.role === 'admin'}
              />
            )}

            {drawer.type === 'alert' && drawer.data && (
              <AlertDetailDrawerContent 
                alert={drawer.data}
                onClose={closeDrawer}
                onAcknowledge={handleAcknowledgeAlert}
                onResolve={handleResolveAlert}
                onInspectJob={() => {
                  const targetJob = jobs.find(j => j.id === drawer.data.jobId);
                  if (targetJob) openJobDrawer(targetJob);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* 5. Schedule Job Modal (Admin only) */}
      {scheduleModalOpen && (
        <ScheduleJobModal 
          onClose={() => setScheduleModalOpen(false)}
          onAddJob={(newJob) => {
            setJobs(prev => [newJob, ...prev]);
            setScheduleModalOpen(false);
            showToast("success", `Scheduled new job ${newJob.name}`);
          }}
        />
      )}

      {/* 6. Toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#0f172a' }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// AUTHENTICATION: STAWHATS ENTERPRISE LOGIN PAGE
// =========================================================================
function LoginPage({ onLogin, appName = "Stawhats" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setInfoMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password to continue.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g., name@stawhats.enterprise).");
      return;
    }

    // Role-based authentication logic:
    // Admin login must open the Admin dashboard.
    // User login must open the User dashboard.
    const isAdmin = role === "admin";
    const userData = isAdmin
      ? {
          name: "Sarah Vance",
          email: email.trim(),
          role: "admin",
          title: "Platform Administrator"
        }
      : {
          name: "Alex Chen",
          email: email.trim(),
          role: "user",
          title: "Operations User"
        };

    if (rememberMe) {
      try {
        localStorage.setItem("stawhats_user", JSON.stringify(userData));
      } catch (err) {}
    } else {
      try {
        localStorage.removeItem("stawhats_user");
      } catch (err) {}
    }

    setError("");
    onLogin(userData);
  };

  const autofill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail("admin@stawhats.enterprise");
      setPassword("Admin@123");
    } else {
      setEmail("operator@stawhats.enterprise");
      setPassword("User@123");
    }
    setError("");
    setInfoMessage("");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setInfoMessage(`To reset credentials, please contact your ${appName} enterprise security officer or select a demo account below.`);
    setError("");
  };

  return (
    <div className="stawhats-login-page">
      {/* LEFT SIDE: Dark Teal Enterprise Operations Showcase */}
      <div className="stawhats-left-panel">
        <div className="stawhats-left-top">
          <div className="stawhats-brand-header">
            <div className="stawhats-logo-mark">
              <StawhatsLogo size={32} isLight={true} />
            </div>
            <span className="stawhats-brand-name-light">{appName}</span>
          </div>
        </div>

        <div className="stawhats-left-center">
          <span className="stawhats-eyebrow-light">ENTERPRISE OPERATIONS</span>
          <h2 className="stawhats-hero-headline">Clarity at every workflow.</h2>
          <p className="stawhats-hero-subtext">
            Reliable batch monitoring and workflow intelligence for enterprise operations.
          </p>
        </div>

        {/* Subtle Large Circular Abstract Shape in Lower-Right Area */}
        <div className="stawhats-abstract-shape" aria-hidden="true">
          <svg width="440" height="440" viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="220" cy="220" r="216" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1.5" />
            <circle cx="220" cy="220" r="168" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
            <circle cx="220" cy="220" r="118" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="220" cy="220" r="68" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
            <circle cx="220" cy="220" r="20" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
          </svg>
        </div>

        <div className="stawhats-left-bottom">
          <div className="stawhats-secure-badge-label">
            <Icons.ShieldCheck />
            <span>SECURE ACCESS</span>
          </div>
          <div className="stawhats-secure-badge-text">
            Protected operational workspace
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: White / Off-white Login Form */}
      <div className="stawhats-right-panel">
        <div className="stawhats-form-container">
          <div className="stawhats-form-header">
            <div className="stawhats-form-brand">
              <StawhatsLogo size={28} isLight={false} />
              <span className="stawhats-brand-name-dark">{appName}</span>
            </div>
            <div>
              <span className="stawhats-eyebrow-dark">SECURE SIGN IN</span>
              <h1 className="stawhats-form-title">Welcome back</h1>
              <p className="stawhats-form-subtitle">
                Sign in to continue to your operations workspace.
              </p>
            </div>
          </div>

          {error && (
            <div className="stawhats-error-banner" role="alert">
              <Icons.Cross />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginBottom: 18, lineHeight: 1.4 }}>
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} noValidate>
            <div className="stawhats-field-group">
              <label className="stawhats-label" htmlFor="stawhats-email">Email address</label>
              <input
                id="stawhats-email"
                type="email"
                className="stawhats-input"
                placeholder="name@stawhats.enterprise"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                required
              />
            </div>

            <div className="stawhats-field-group">
              <label className="stawhats-label" htmlFor="stawhats-password">Password</label>
              <div className="stawhats-password-wrapper">
                <input
                  id="stawhats-password"
                  type={showPassword ? "text" : "password"}
                  className="stawhats-password-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="stawhats-toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
            </div>

            <div className="stawhats-field-group">
              <label className="stawhats-label" htmlFor="stawhats-role">Workspace Role</label>
              <div className="stawhats-select-wrapper">
                <select
                  id="stawhats-role"
                  className="stawhats-select"
                  value={role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setRole(newRole);
                    if (error) setError("");
                    if (email === "operator@stawhats.enterprise" && newRole === "admin") {
                      setEmail("admin@stawhats.enterprise");
                      setPassword("Admin@123");
                    } else if (email === "admin@stawhats.enterprise" && newRole === "user") {
                      setEmail("operator@stawhats.enterprise");
                      setPassword("User@123");
                    }
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <div className="stawhats-options-row">
              <label className="stawhats-checkbox-label" htmlFor="stawhats-remember">
                <input
                  id="stawhats-remember"
                  type="checkbox"
                  className="stawhats-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                className="stawhats-forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="stawhats-submit-btn">
              Sign in to {appName}
            </button>
          </form>

          {/* Demo / Help text below button */}
          <div className="stawhats-demo-box">
            <div className="stawhats-demo-label">
              <Icons.Clock />
              <span>Quick Demo Accounts (Click to Fill)</span>
            </div>
            <div className="stawhats-demo-chips">
              <button
                type="button"
                className="stawhats-demo-chip"
                onClick={() => autofill('admin')}
              >
                <strong>Admin · Sarah Vance</strong>
                <span>admin@stawhats.enterprise</span>
              </button>
              <button
                type="button"
                className="stawhats-demo-chip"
                onClick={() => autofill('user')}
              >
                <strong>User · Alex Chen</strong>
                <span>operator@stawhats.enterprise</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN DASHBOARD: SIMPLE & UNCLUTTERED (PROGRESSIVE DISCLOSURE)
// =========================================================================
function DashboardView({ jobs, alerts, onOpenJob, onOpenAlert, onNavigate }) {
  const activeAlerts = useMemo(() => alerts.filter(a => a.status === 'active'), [alerts]);
  const recentJobs = useMemo(() => jobs.slice(0, 5), [jobs]);
  const upcomingJobs = useMemo(() => jobs.slice(0, 4), [jobs]);

  return (
    <div>
      {/* 6 Clean Summary KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigate('jobs')}>
          <div className="kpi-top">
            <span className="kpi-title">Total Jobs</span>
            <div className="kpi-icon-wrap blue"><Icons.Jobs /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">1,482</span>
            <span className="kpi-delta positive">↑ 3.2%</span>
          </div>
          <span className="kpi-subtext">Click to view all</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('jobs')}>
          <div className="kpi-top">
            <span className="kpi-title">Running</span>
            <div className="kpi-icon-wrap blue"><Icons.Play /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">18</span>
            <span className="kpi-delta neutral">24 Max</span>
          </div>
          <span className="kpi-subtext">75% worker load</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('jobs')}>
          <div className="kpi-top">
            <span className="kpi-title">Successful</span>
            <div className="kpi-icon-wrap green"><Icons.Check /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">1,424</span>
            <span className="kpi-delta positive">96.1%</span>
          </div>
          <span className="kpi-subtext">Last 24 hours</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('jobs')}>
          <div className="kpi-top">
            <span className="kpi-title">Failed</span>
            <div className="kpi-icon-wrap red"><Icons.Cross /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">14</span>
            <span className="kpi-delta negative">3 Blockers</span>
          </div>
          <span className="kpi-subtext">Requires review</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('jobs')}>
          <div className="kpi-top">
            <span className="kpi-title">Delayed</span>
            <div className="kpi-icon-wrap amber"><Icons.Clock /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">26</span>
            <span className="kpi-delta neutral">+14m</span>
          </div>
          <span className="kpi-subtext">SLA lag detected</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('alerts')}>
          <div className="kpi-top">
            <span className="kpi-title">Predicted Risks</span>
            <div className="kpi-icon-wrap amber"><Icons.Alerts /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">5</span>
            <span className="kpi-delta neutral">94% Acc</span>
          </div>
          <span className="kpi-subtext">Mitigations ready</span>
        </div>
      </div>

      {/* ONLY 3 CLEAN SECTIONS BELOW */}
      <div className="dashboard-sections">
        {/* Section 1: Recent Job Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Job Activity</div>
              <div className="card-subtitle">Click any job to reveal execution timeline, logs, and dependencies</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('jobs')}>
              View All →
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Name & ID</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(job => (
                  <tr 
                    key={job.id} 
                    className="clickable-row"
                    onClick={() => onOpenJob(job)}
                    title="Click to view job details"
                  >
                    <td>
                      <div className="job-name-cell">
                        <span className="job-primary-name">{job.name}</span>
                        <span className="job-id-code">{job.id} • {job.domain}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${job.status}`}>{job.status}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{job.duration}</td>
                    <td style={{ color: '#64748b' }}>{job.lastRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Critical Alerts */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Critical Alerts ({activeAlerts.length})</div>
              <div className="card-subtitle">Click alert to inspect cause and acknowledge/resolve</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('alerts')}>
              All Alerts →
            </button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => onOpenAlert(alert)}
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderLeft: alert.severity === 'Critical' ? '3px solid #b91c1c' : '3px solid #b45309',
                  borderRadius: 4, 
                  padding: '9px 12px',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <strong style={{ fontSize: 12, color: '#0f172a' }}>{alert.title}</strong>
                  <span style={{ fontSize: 10.5, color: '#64748b' }}>{alert.time}</span>
                </div>
                <div style={{ fontSize: 11, color: '#475569' }}>
                  {alert.jobId}: {alert.jobName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Upcoming Jobs */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Upcoming Scheduled Batch Windows</div>
            <div className="card-subtitle">Next batch executions queued across cluster nodes</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('scheduler')}>
            View Calendar Schedule →
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Identifier</th>
                <th>Scheduled Cron</th>
                <th>Next Execution Window</th>
                <th>Assigned Worker Pool</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {upcomingJobs.map(job => (
                <tr 
                  key={job.id} 
                  className="clickable-row"
                  onClick={() => onOpenJob(job)}
                  title="Click to view schedule details"
                >
                  <td>
                    <strong>{job.name}</strong> ({job.id})
                  </td>
                  <td>
                    <code>{job.schedule.split(' ')[0]} {job.schedule.split(' ')[1]} {job.schedule.split(' ')[2]}</code>
                  </td>
                  <td style={{ color: '#0f172a', fontWeight: 600 }}>{job.nextRun}</td>
                  <td style={{ color: '#64748b' }}>{job.worker}</td>
                  <td>
                    <span style={{ fontSize: 11, color: job.priority === 'Critical' ? '#b91c1c' : '#475569', fontWeight: 600 }}>
                      {job.priority}
                    </span>
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

// =========================================================================
// JOB MONITORING VIEW (SEARCHABLE TABLE -> CLICK OPENS DRAWER)
// =========================================================================
function JobMonitoringView({ jobs, onOpenJob, onTriggerRun, isAdmin, onNewJob }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchText = j.name.toLowerCase().includes(search.toLowerCase()) || j.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || j.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Jobs />
            Job Monitoring Registry
          </h2>
          <p>Search and click any batch job to inspect execution history, logs, and dependencies.</p>
        </div>
        <div className="page-actions">
          {isAdmin && (
            <button className="btn btn-primary" onClick={onNewJob}>
              + Schedule Job
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="filter-group">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by job name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '240px', height: '30px' }}
            />
            <select 
              className="select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status: All</option>
              <option value="running">Running</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b' }}>
            Showing {filtered.length} of {jobs.length} jobs
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Name & ID</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Duration / SLA</th>
                <th>Dependencies</th>
                <th>Last Run</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr 
                  key={job.id} 
                  className="clickable-row"
                  onClick={() => onOpenJob(job)}
                >
                  <td>
                    <div className="job-name-cell">
                      <span className="job-primary-name">{job.name}</span>
                      <span className="job-id-code">{job.id} • {job.domain}</span>
                    </div>
                  </td>
                  <td>{job.schedule.substring(0, job.schedule.indexOf('('))}</td>
                  <td><span className={`status-pill ${job.status}`}>{job.status}</span></td>
                  <td>
                    <strong>{job.duration}</strong>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Limit: {job.slaLimit}</div>
                  </td>
                  <td>{job.dependenciesCount.up} in / {job.dependenciesCount.down} out</td>
                  <td style={{ color: '#64748b' }}>{job.lastRun}</td>
                  <td>
                    <button 
                      className="action-btn-mini primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerRun(job.id);
                      }}
                      title="Run Now"
                    >
                      <Icons.Play />
                    </button>
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

// =========================================================================
// PROGRESSIVE DISCLOSURE: JOB DETAIL DRAWER
// =========================================================================
function JobDetailDrawerContent({ job, onClose, onRun, onRetry, isAdmin }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <div className="drawer-header">
        <div className="drawer-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span className="job-id-code" style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 }}>
              {job.id}
            </span>
            <span className={`status-pill ${job.status}`}>{job.status}</span>
          </div>
          <h3>{job.name}</h3>
        </div>
        <button className="action-btn-mini" onClick={onClose}><Icons.Cross /></button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 18px 0 18px', borderBottom: '1px solid #e2e8f0', background: '#fafbfc' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'logs', label: 'Terminal Logs' },
          { id: 'history', label: 'History' },
          { id: 'dependencies', label: 'Dependencies' }
        ].map(t => (
          <button 
            key={t.id}
            className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '4px 4px 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="drawer-body">
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {job.status === 'failed' && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 4, padding: '10px 12px' }}>
                <strong style={{ color: '#991b1b', fontSize: 12, display: 'block' }}>Failure Reason:</strong>
                <div style={{ fontSize: 11.5, color: '#7f1d1d', marginTop: 2, fontFamily: 'JetBrains Mono' }}>
                  {job.failureReason}
                </div>
              </div>
            )}

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: 10.5 }}>DOMAIN</span>
                  <strong>{job.domain}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: 10.5 }}>SLA TIER</span>
                  <strong>{job.slaTier}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: 10.5 }}>DURATION</span>
                  <strong>{job.duration} (Limit: {job.slaLimit})</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: 10.5 }}>RECORDS</span>
                  <strong>{job.records}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: 10.5 }}>ASSIGNED WORKER</span>
                  <code>{job.worker}</code>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: 10.5 }}>CLUSTER</span>
                  <code>{job.cluster}</code>
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Schedule</span>
              <div style={{ fontSize: 12.5, color: '#0f172a', marginTop: 2 }}>{job.schedule}</div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="terminal-compact">
            {JOB_LOGS_SAMPLE.map((l, i) => (
              <div key={i} style={{ padding: '1px 0', wordBreak: 'break-all' }}>
                <span style={{ color: '#64748b' }}>{l.time}</span> <span style={{ color: l.level === 'ERROR' ? '#f87171' : l.level === 'WARN' ? '#fbbf24' : '#60a5fa' }}>[{l.level}]</span> {l.msg}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { run: "#948210", start: "2026-09-29 04:00:00", dur: "28m 01s", status: job.status },
              { run: "#948209", start: "2026-09-28 04:00:00", dur: "25m 12s", status: "success" },
              { run: "#948208", start: "2026-09-27 04:00:00", dur: "23m 44s", status: "success" }
            ].map((h, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: 4, fontSize: 11.5 }}>
                <span><strong>{h.run}</strong> • {h.start}</span>
                <span className={`status-pill ${h.status}`}>{h.status} ({h.dur})</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Upstream Prerequisites ({job.dependenciesCount.up})</div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 4, fontSize: 11.5 }}>
              <strong>BJ-1092: Core Banking Transaction Sync</strong> (Output: transactions_delta_partition)
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginTop: 6 }}>Downstream Consumers ({job.dependenciesCount.down})</div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 4, fontSize: 11.5 }}>
              <strong>BJ-1101: Executive Daily P&L Dashboard</strong> (Input: gl_balance_summary)
            </div>
          </div>
        )}
      </div>

      <div className="drawer-footer">
        {job.status === 'failed' ? (
          <button className="btn btn-danger" onClick={() => onRetry(job.id)}>
            <Icons.Refresh /> Retry Failed Task
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => onRun(job.id)}>
            <Icons.Play /> Run Again Now
          </button>
        )}
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </>
  );
}

// =========================================================================
// PROGRESSIVE DISCLOSURE: ALERT DETAIL DRAWER
// =========================================================================
function AlertDetailDrawerContent({ alert, onClose, onAcknowledge, onResolve, onInspectJob }) {
  return (
    <>
      <div className="drawer-header">
        <div className="drawer-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span className={`status-pill ${alert.severity === 'Critical' ? 'failed' : 'delayed'}`}>
              {alert.severity}
            </span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{alert.id}</span>
          </div>
          <h3>{alert.title}</h3>
        </div>
        <button className="action-btn-mini" onClick={onClose}><Icons.Cross /></button>
      </div>

      <div className="drawer-body">
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 }}>AFFECTED BATCH JOB</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{alert.jobName}</div>
          <div style={{ fontSize: 11, color: '#2563eb', cursor: 'pointer', marginTop: 2 }} onClick={onInspectJob}>
            View Job Details ({alert.jobId}) →
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Root Cause & Symptoms</div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: 10, fontSize: 12, color: '#334155' }}>
            {alert.reason}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Recommended Remediation</div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, padding: 10, fontSize: 12, color: '#1e40af' }}>
            {alert.recommendedAction}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
          <span>Reported: <strong>{alert.time}</strong></span>
          <span>Status: <strong style={{ textTransform: 'capitalize' }}>{alert.status}</strong></span>
        </div>
      </div>

      <div className="drawer-footer">
        {alert.status === 'active' && (
          <button className="btn btn-secondary" onClick={() => onAcknowledge(alert.id)}>
            Acknowledge
          </button>
        )}
        {alert.status !== 'resolved' && (
          <button className="btn btn-primary" onClick={() => onResolve(alert.id)}>
            <Icons.Check /> Mark as Resolved
          </button>
        )}
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </>
  );
}

// =========================================================================
// DEPENDENCY MAP VIEW (SIMPLE WORKFLOW GRAPH)
// =========================================================================
function DependencyMapView({ dag, onOpenJobById }) {
  const [selectedNode, setSelectedNode] = useState(dag.nodes[2]); // BJ-1094 default

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Map />
            Workflow Dependency Map
          </h2>
          <p>Click any node to view job dependencies and failure cascade paths.</p>
        </div>
      </div>

      <div className="card">
        <div className="dag-wrapper">
          <div className="dag-controls-bar">
            <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>Workflow Sequence</span>
          </div>

          <div className="dag-legend-bar">
            <div className="legend-item"><span className="health-status-dot green"></span> Success</div>
            <div className="legend-item"><span className="health-status-dot red"></span> Failed</div>
            <div className="legend-item"><span className="health-status-dot amber"></span> Blocked</div>
          </div>

          <svg className="dag-svg" viewBox="0 0 1150 360">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-failed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
              </marker>
            </defs>

            {dag.edges.map((edge, idx) => {
              const source = dag.nodes.find(n => n.id === edge.from);
              const target = dag.nodes.find(n => n.id === edge.to);
              if (!source || !target) return null;

              const startX = source.x + 180;
              const startY = source.y + 36;
              const endX = target.x;
              const endY = target.y + 36;

              const isFailedEdge = source.status === 'failed' || target.status === 'failed';

              return (
                <g key={idx}>
                  <line 
                    x1={startX} 
                    y1={startY} 
                    x2={endX} 
                    y2={endY} 
                    stroke={isFailedEdge ? "#dc2626" : "#94a3b8"}
                    strokeWidth="1.5"
                    strokeDasharray={isFailedEdge ? "4 3" : "none"}
                    markerEnd={isFailedEdge ? "url(#arrow-failed)" : "url(#arrow)"}
                  />
                  <text 
                    x={(startX + endX) / 2} 
                    y={startY - 6} 
                    fill="#64748b" 
                    fontSize="9.5" 
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {dag.nodes.map(node => {
              const isSelected = selectedNode && selectedNode.id === node.id;
              const statusColor = node.status === 'success' ? '#15803d' : node.status === 'failed' ? '#dc2626' : '#b45309';

              return (
                <g 
                  key={node.id} 
                  className={`dag-node ${isSelected ? 'selected' : ''}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                >
                  <rect 
                    width="180" 
                    height="72" 
                    rx="5" 
                    fill="#ffffff" 
                    stroke={isSelected ? '#2563eb' : '#cbd5e1'} 
                    strokeWidth={isSelected ? "2" : "1"}
                  />
                  <rect width="180" height="3" fill={statusColor} />
                  <text x="10" y="20" fill="#64748b" fontSize="9.5" fontWeight="600" textTransform="uppercase">{node.stage}</text>
                  <text x="170" y="20" fill="#94a3b8" fontSize="9" textAnchor="end">{node.jobId}</text>
                  <text x="10" y="38" fill="#0f172a" fontSize="11" fontWeight="600">{node.label}</text>
                  <text x="10" y="58" fill="#64748b" fontSize="10">{node.duration} • {node.records}</text>
                  <circle cx="168" cy="56" r="3.5" fill={statusColor} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Details Box (Progressive Disclosure) */}
      {selectedNode && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Selected Node: {selectedNode.label} ({selectedNode.jobId})</div>
            <button className="btn btn-primary btn-sm" onClick={() => onOpenJobById(selectedNode.jobId)}>
              Inspect Full Job Details →
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 12 }}>
              <div>
                <span style={{ color: '#64748b', fontSize: 10.5, display: 'block' }}>STAGE</span>
                <strong>{selectedNode.stage}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: 10.5, display: 'block' }}>STATUS</span>
                <span className={`status-pill ${selectedNode.status}`}>{selectedNode.status}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: 10.5, display: 'block' }}>DURATION</span>
                <strong>{selectedNode.duration}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: 10.5, display: 'block' }}>OUTPUT DATASET</span>
                <strong>{selectedNode.records} records</strong>
              </div>
            </div>

            {selectedNode.status === 'failed' && (
              <div style={{ marginTop: 12, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 4, padding: '8px 10px', fontSize: 11.5, color: '#991b1b' }}>
                <strong>Deadlock Blocker:</strong> PostgreSQL transaction contention on table 'gl_daily_balance'. Blocked Report Generation and Email Delivery.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// ALERTS VIEW (LIST -> CLICK OPENS DRAWER -> ACKNOWLEDGE / RESOLVE)
// =========================================================================
function AlertsView({ alerts, onOpenAlert, onAcknowledge, onResolve }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter(a => a.status === filter);
  }, [alerts, filter]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Alerts />
            Operational Alerts
          </h2>
          <p>Review system errors, SLA violations, and take acknowledgement actions.</p>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="filter-group">
            {['all', 'active', 'acknowledged', 'resolved'].map(f => (
              <button 
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
                onClick={() => setFilter(f)}
              >
                {f} ({alerts.filter(a => f === 'all' || a.status === f).length})
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Alert Title</th>
                <th>Affected Job</th>
                <th>Severity</th>
                <th>Time</th>
                <th>Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(alert => (
                <tr 
                  key={alert.id} 
                  className="clickable-row"
                  onClick={() => onOpenAlert(alert)}
                >
                  <td>
                    <strong>{alert.title}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{alert.reason.substring(0, 75)}...</div>
                  </td>
                  <td>{alert.jobId} ({alert.jobName})</td>
                  <td>
                    <span className={`status-pill ${alert.severity === 'Critical' ? 'failed' : 'delayed'}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{alert.time}</td>
                  <td>
                    <span style={{ 
                      fontSize: 11, 
                      fontWeight: 600,
                      color: alert.status === 'resolved' ? '#15803d' : alert.status === 'acknowledged' ? '#b45309' : '#b91c1c',
                      textTransform: 'capitalize'
                    }}>
                      {alert.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {alert.status === 'active' && (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcknowledge(alert.id);
                          }}
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status !== 'resolved' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolve(alert.id);
                          }}
                        >
                          Resolve
                        </button>
                      )}
                    </div>
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

// =========================================================================
// SCHEDULER VIEW (SIMPLE UPCOMING JOBS LIST & CALENDAR)
// =========================================================================
function SchedulerView({ jobs, onOpenJob, isAdmin, onNewJob }) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Scheduler />
            Batch Scheduler
          </h2>
          <p>Scheduled execution calendar and upcoming batch windows.</p>
        </div>
        <div className="page-actions">
          {isAdmin && (
            <button className="btn btn-primary" onClick={onNewJob}>
              + Schedule Job
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Upcoming Batch Job Runs (Next 24 Hours)</div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Identifier</th>
                <th>Cron Expression</th>
                <th>Next Scheduled Window</th>
                <th>Estimated Runtime</th>
                <th>Target Node</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr 
                  key={job.id} 
                  className="clickable-row"
                  onClick={() => onOpenJob(job)}
                >
                  <td><strong>{job.name}</strong> ({job.id})</td>
                  <td><code>{job.schedule.split(' ')[0]} {job.schedule.split(' ')[1]} {job.schedule.split(' ')[2]}</code></td>
                  <td style={{ color: '#0f172a', fontWeight: 600 }}>{job.nextRun}</td>
                  <td>{job.duration !== '--' ? job.duration : '20m 00s'}</td>
                  <td style={{ color: '#64748b' }}>{job.worker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// ENTERPRISE REPORTS & SLA MONITORING ENGINE
// =========================================================================

// Duration parsing and formatting utilities
function parseDurationSec(str) {
  if (!str || str === '--') return 0;
  let totalSec = 0;
  const hMatch = str.match(/(\d+)\s*h/i);
  const mMatch = str.match(/(\d+)\s*m/i);
  const sMatch = str.match(/(\d+)\s*s/i);
  if (hMatch) totalSec += parseInt(hMatch[1], 10) * 3600;
  if (mMatch) totalSec += parseInt(mMatch[1], 10) * 60;
  if (sMatch) totalSec += parseInt(sMatch[1], 10);
  return totalSec;
}

function formatDurationSec(sec) {
  if (!sec || isNaN(sec) || sec <= 0) return "--";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  }
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

// Sample 7-run compliance history generator per job
function generateJobRunHistory(job, slaStatus) {
  const baseSec = parseDurationSec(job.duration) || 1400;
  const isFailed = job.status === 'failed';
  const runs = [
    { run: "#948210", date: "2026-09-29 02:00", dur: job.duration, status: isFailed ? 'failed' : (job.status === 'delayed' ? 'delayed' : 'success'), sla: slaStatus },
    { run: "#948209", date: "2026-09-28 02:00", dur: formatDurationSec(Math.max(baseSec - 90, 600)), status: 'success', sla: 'Met' },
    { run: "#948208", date: "2026-09-27 02:00", dur: formatDurationSec(Math.max(baseSec + 45, 600)), status: 'success', sla: (baseSec + 45 > 1800) ? 'At Risk' : 'Met' },
    { run: "#948207", date: "2026-09-26 02:00", dur: formatDurationSec(Math.max(baseSec - 120, 500)), status: 'success', sla: 'Met' },
    { run: "#948206", date: "2026-09-25 02:00", dur: formatDurationSec(Math.max(baseSec + 150, 700)), status: isFailed ? 'failed' : 'success', sla: isFailed ? 'Breached' : 'Met' },
    { run: "#948205", date: "2026-09-24 02:00", dur: formatDurationSec(Math.max(baseSec - 40, 600)), status: 'success', sla: 'Met' },
    { run: "#948204", date: "2026-09-23 02:00", dur: formatDurationSec(Math.max(baseSec - 80, 580)), status: 'success', sla: 'Met' }
  ];
  return runs;
}

// Root cause & remediation guidance mappings
function getRemediationPlaybook(job, slaStatus) {
  if (job.status === 'failed') {
    return {
      reason: job.failureReason || "Process execution exception encountered during ingestion stage.",
      action: "Review stack trace, apply SERIALIZABLE transaction isolation or re-validate schema payload, then trigger a manual or automated backoff retry."
    };
  }
  if (job.status === 'delayed' || slaStatus === 'Breached') {
    return {
      reason: job.failureReason || "Execution overrun caused by upstream partition queuing and node resource saturation.",
      action: "Scale worker node executor memory from 8GB to 16GB, optimize shuffle partitioning, and consider splitting the cron batch window into hourly increments."
    };
  }
  if (slaStatus === 'At Risk') {
    return {
      reason: "Runtime is approaching the upper warning threshold (>80% of SLA time window consumed).",
      action: "Pre-warm database connection pools and evaluate recent data growth trends to prevent breaches during peak end-of-month processing."
    };
  }
  return {
    reason: "Batch execution completed within standard operating limits.",
    action: "Execution healthy with adequate safety buffer. Continue automated monitoring without manual intervention."
  };
}

// =========================================================================
// MAIN REPORTS VIEW COMPONENT
// =========================================================================
function ReportsView({ jobs = INITIAL_JOBS, dag = INITIAL_DAG, alerts = INITIAL_ALERTS, currentUser, onOpenJob, showToast }) {
  const navigate = useNavigate();
  const isAdmin = currentUser && currentUser.role === 'admin';

  // 1. SLA Threshold Settings (persisted in localStorage)
  const [thresholds, setThresholds] = useState(() => {
    try {
      const saved = localStorage.getItem('stawhats_sla_thresholds');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      targetCompliancePct: 98.5,
      warningThresholdPct: 80,
      defaultLimitMinutes: 30
    };
  });

  // 2. Filter State
  const [dateRange, setDateRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slaStatusFilter, setSlaStatusFilter] = useState('all');
  const [kpiFilterFocus, setKpiFilterFocus] = useState(null);

  // 3. UI Navigation State
  const [activeChartTab, setActiveChartTab] = useState('volume'); // 'volume' | 'compliance' | 'duration' | 'failures'
  const [selectedSlaJob, setSelectedSlaJob] = useState(null);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  // Admin threshold form state
  const [tempThresholds, setTempThresholds] = useState({ ...thresholds });

  // Canvas ref for Chart.js
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Enrich jobs with mathematical SLA computations
  const enrichedJobs = useMemo(() => {
    return jobs.map(job => {
      const targetSec = parseDurationSec(job.slaLimit) || (thresholds.defaultLimitMinutes * 60);
      const actualSec = parseDurationSec(job.duration);
      
      let slaStatus = 'Met';
      let delayMargin = '--';
      let isOverrun = false;
      let pctConsumed = 0;

      if (actualSec > 0 && targetSec > 0) {
        pctConsumed = Math.round((actualSec / targetSec) * 100);
      }

      if (job.status === 'failed') {
        slaStatus = 'Breached';
        delayMargin = 'Execution Failed';
        isOverrun = true;
      } else if (job.status === 'delayed') {
        slaStatus = 'Breached';
        const diff = Math.max(actualSec - targetSec, 360);
        delayMargin = `+${formatDurationSec(diff)} Overrun`;
        isOverrun = true;
        pctConsumed = Math.max(pctConsumed, 118);
      } else if (actualSec > targetSec) {
        slaStatus = 'Breached';
        delayMargin = `+${formatDurationSec(actualSec - targetSec)} Over Target`;
        isOverrun = true;
      } else if (actualSec >= targetSec * (thresholds.warningThresholdPct / 100)) {
        slaStatus = 'At Risk';
        delayMargin = `${formatDurationSec(targetSec - actualSec)} Buffer Left`;
        isOverrun = false;
      } else if (actualSec > 0) {
        slaStatus = 'Met';
        delayMargin = `-${formatDurationSec(targetSec - actualSec)} Under Target`;
        isOverrun = false;
      }

      return {
        ...job,
        targetSec,
        actualSec,
        slaStatus,
        delayMargin,
        isOverrun,
        pctConsumed
      };
    });
  }, [jobs, thresholds]);

  // Apply User Filters
  const filteredJobs = useMemo(() => {
    return enrichedJobs.filter(job => {
      // Search query filter (matches name, id, owner)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = job.name && job.name.toLowerCase().includes(q);
        const matchId = job.id && job.id.toLowerCase().includes(q);
        const matchOwner = job.owner && job.owner.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchOwner) return false;
      }

      // Domain filter
      if (domainFilter !== 'all' && job.domain !== domainFilter) {
        return false;
      }

      // Execution status filter
      if (statusFilter !== 'all' && job.status !== statusFilter) {
        return false;
      }

      // SLA Status filter
      if (slaStatusFilter !== 'all' && job.slaStatus !== slaStatusFilter) {
        return false;
      }

      // KPI interactive filter focus
      if (kpiFilterFocus === 'failed' && job.status !== 'failed') return false;
      if (kpiFilterFocus === 'delayed' && (job.status !== 'delayed' && job.slaStatus !== 'Breached')) return false;
      if (kpiFilterFocus === 'success' && job.status !== 'success') return false;
      if (kpiFilterFocus === 'met' && job.slaStatus !== 'Met') return false;

      return true;
    });
  }, [enrichedJobs, searchQuery, domainFilter, statusFilter, slaStatusFilter, kpiFilterFocus]);

  // Dynamically calculate 6 core KPIs from filtered records
  const kpis = useMemo(() => {
    const totalExecuted = filteredJobs.filter(j => j.duration !== '--').length;
    const allTotal = filteredJobs.length || 1;
    const executedDenominator = totalExecuted || 1;

    const successJobs = filteredJobs.filter(j => j.status === 'success');
    const failedJobs = filteredJobs.filter(j => j.status === 'failed');
    const delayedJobs = filteredJobs.filter(j => j.status === 'delayed' || j.slaStatus === 'Breached');
    const metJobs = filteredJobs.filter(j => j.slaStatus === 'Met');

    const successRate = totalExecuted > 0 
      ? ((successJobs.length / executedDenominator) * 100).toFixed(1)
      : '0.0';
    
    const failureRate = totalExecuted > 0 
      ? ((failedJobs.length / executedDenominator) * 100).toFixed(1)
      : '0.0';

    const slaComplianceRate = totalExecuted > 0 
      ? ((metJobs.length / executedDenominator) * 100).toFixed(1)
      : '0.0';

    const totalSeconds = filteredJobs.reduce((acc, j) => acc + (j.actualSec || 0), 0);
    const avgDurationSec = totalExecuted > 0 ? Math.round(totalSeconds / executedDenominator) : 0;
    const avgDurationFormatted = formatDurationSec(avgDurationSec);

    return {
      totalExecuted: allTotal,
      successRate: `${successRate}%`,
      failureRate: `${failureRate}%`,
      avgDuration: avgDurationFormatted !== '--' ? avgDurationFormatted : '24m 18s',
      slaComplianceRate: `${slaComplianceRate}%`,
      delayedJobsCount: delayedJobs.length,
      metJobsCount: metJobs.length,
      failedJobsCount: failedJobs.length
    };
  }, [filteredJobs]);

  // Domain reliability scorecard calculation
  const domainReliability = useMemo(() => {
    const domains = [
      "Financial Settlement",
      "Risk & Compliance",
      "Customer 360",
      "Data Platform",
      "Supply Chain"
    ];

    return domains.map(d => {
      const dJobs = enrichedJobs.filter(j => j.domain === d);
      const total = dJobs.length;
      if (total === 0) return { domain: d, score: 100, count: 0, status: 'Met' };
      const metCount = dJobs.filter(j => j.slaStatus === 'Met').length;
      const score = Math.round((metCount / total) * 100);
      const hasBreached = dJobs.some(j => j.slaStatus === 'Breached');
      const status = hasBreached ? 'Breached' : (score < 90 ? 'At Risk' : 'Met');
      return { domain: d, score, count: total, status };
    });
  }, [enrichedJobs]);

  // Reset all filters back to default
  const handleResetFilters = () => {
    setDateRange('7d');
    setSearchQuery('');
    setDomainFilter('all');
    setStatusFilter('all');
    setSlaStatusFilter('all');
    setKpiFilterFocus(null);
    if (showToast) showToast("All report filters reset to default");
  };

  // CSV Export for filtered jobs and SLA status
  const handleExportCsv = () => {
    const headers = [
      "Job Identifier",
      "Job Display Name",
      "Domain Pipeline",
      "Schedule",
      "Target Completion Time",
      "Actual Duration",
      "SLA Status",
      "Delay / Variance Margin",
      "Execution Status",
      "Last Execution UTC",
      "Cluster",
      "Owner Team"
    ];

    const rows = filteredJobs.map(job => [
      `"${job.id}"`,
      `"${(job.name || '').replace(/"/g, '""')}"`,
      `"${(job.domain || '').replace(/"/g, '""')}"`,
      `"${(job.schedule || '').replace(/"/g, '""')}"`,
      `"${job.slaLimit || thresholds.defaultLimitMinutes + 'm 00s'}"`,
      `"${job.duration || '--'}"`,
      `"${job.slaStatus}"`,
      `"${job.delayMargin}"`,
      `"${job.status}"`,
      `"${job.lastRun || '--'}"`,
      `"${job.cluster || 'prod-us-east-1'}"`,
      `"${job.owner || 'Operations'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayDate = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `stawhats_sla_report_${todayDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (showToast) showToast("SLA report exported as CSV successfully");
  };

  // Print / Save as PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Admin threshold save handler
  const handleSaveThresholds = (e) => {
    e.preventDefault();
    const updated = {
      targetCompliancePct: parseFloat(tempThresholds.targetCompliancePct) || 98.5,
      warningThresholdPct: parseFloat(tempThresholds.warningThresholdPct) || 80,
      defaultLimitMinutes: parseInt(tempThresholds.defaultLimitMinutes, 10) || 30
    };
    try {
      localStorage.setItem('stawhats_sla_thresholds', JSON.stringify(updated));
    } catch (err) {}
    setThresholds(updated);
    setIsThresholdModalOpen(false);
    if (showToast) showToast("SLA thresholds updated and applied to analytics");
  };

  // Interactive Chart.js rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.45)' : '#f1f5f9';

    let chartConfig;

    if (activeChartTab === 'volume') {
      // 1. Daily Execution Volume & Status (Stacked Bar)
      const labels = dateRange === 'today'
        ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        : dateRange === '14d'
        ? ['Oct 01', 'Oct 02', 'Oct 03', 'Oct 04', 'Oct 05', 'Oct 06', 'Oct 07', 'Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14']
        : ['Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14'];

      chartConfig = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Successful Executions',
              data: labels.map((_, i) => 135 + ((i * 7) % 25)),
              backgroundColor: '#10b981',
              borderRadius: 4,
              stack: 'stack1'
            },
            {
              label: 'Delayed Jobs',
              data: labels.map((_, i) => 4 + ((i * 3) % 6)),
              backgroundColor: '#f59e0b',
              borderRadius: 4,
              stack: 'stack1'
            },
            {
              label: 'Failed Executions',
              data: labels.map((_, i) => 2 + ((i * 2) % 4)),
              backgroundColor: '#ef4444',
              borderRadius: 4,
              stack: 'stack1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, font: { size: 11, family: 'Inter' } }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { size: 12 },
              bodyFont: { size: 11 },
              padding: 10
            }
          },
          scales: {
            x: {
              stacked: true,
              ticks: { color: textColor, font: { size: 11 } },
              grid: { display: false }
            },
            y: {
              stacked: true,
              ticks: { color: textColor, font: { size: 11 } },
              grid: { color: gridColor }
            }
          }
        }
      };
    } else if (activeChartTab === 'compliance') {
      // 2. SLA Compliance % Over Time vs Commitment Target Line
      const labels = ['Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14'];
      const complianceData = [98.2, 98.7, 99.1, 97.9, 98.8, 99.4, parseFloat(kpis.slaComplianceRate) || 99.1];

      chartConfig = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Actual SLA Adherence %',
              data: complianceData,
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.12)',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#0d9488',
              pointRadius: 4
            },
            {
              label: `Target Commitment (${thresholds.targetCompliancePct}%)`,
              data: labels.map(() => thresholds.targetCompliancePct),
              borderColor: '#ef4444',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, font: { size: 11 } }
            }
          },
          scales: {
            y: {
              min: 94,
              max: 100,
              ticks: { color: textColor, callback: val => `${val}%` },
              grid: { color: gridColor }
            },
            x: {
              ticks: { color: textColor },
              grid: { display: false }
            }
          }
        }
      };
    } else if (activeChartTab === 'duration') {
      // 3. Execution Duration Trends vs SLA Target Limit
      const labels = ['Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14'];
      const avgMinutes = [27.4, 26.2, 25.8, 28.5, 24.9, 23.8, 24.1];

      chartConfig = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Average Batch Duration (Minutes)',
              data: avgMinutes,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              fill: true,
              tension: 0.25,
              pointBackgroundColor: '#2563eb',
              pointRadius: 4
            },
            {
              label: `SLA Target Limit (${thresholds.defaultLimitMinutes}m baseline)`,
              data: labels.map(() => thresholds.defaultLimitMinutes),
              borderColor: '#f59e0b',
              borderDash: [6, 4],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, font: { size: 11 } }
            }
          },
          scales: {
            y: {
              ticks: { color: textColor, callback: val => `${val}m` },
              grid: { color: gridColor }
            },
            x: {
              ticks: { color: textColor },
              grid: { display: false }
            }
          }
        }
      };
    } else {
      // 4. Most Frequently Failing Jobs (Horizontal Bar)
      const failingJobs = [
        { name: "Nightly General Ledger Reconciliation (BJ-1094)", failures: 7 },
        { name: "Global Warehouse Inventory Snapshot (BJ-1099)", failures: 5 },
        { name: "Regulatory Basel-III Compliance (BJ-1097)", failures: 4 },
        { name: "Core Banking Transaction Sync (BJ-1092)", failures: 2 },
        { name: "Executive Daily P&L Dashboard (BJ-1101)", failures: 2 }
      ];

      chartConfig = {
        type: 'bar',
        data: {
          labels: failingJobs.map(j => j.name),
          datasets: [
            {
              label: 'Failure / Delay Incidents (Last 30 Days)',
              data: failingJobs.map(j => j.failures),
              backgroundColor: '#e11d48',
              borderRadius: 4
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, boxWidth: 12, font: { size: 11 } }
            }
          },
          scales: {
            x: {
              ticks: { color: textColor, stepSize: 1 },
              grid: { color: gridColor }
            },
            y: {
              ticks: { color: textColor, font: { size: 10.5 } },
              grid: { display: false }
            }
          }
        }
      };
    }

    chartInstanceRef.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [activeChartTab, dateRange, thresholds, kpis.slaComplianceRate]);

  return (
    <div className="reports-analytics-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Reports />
            Enterprise Reports & SLA Monitoring
          </h2>
          <p>
            Batch execution analytics, service-level compliance tracking, runtime variance, and root cause mitigation.
          </p>
        </div>

        <div className="page-actions reports-actions-row">
          {isAdmin && (
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setTempThresholds({ ...thresholds });
                setIsThresholdModalOpen(true);
              }}
              title="Configure global SLA compliance targets and warning margins"
            >
              <Icons.Sliders /> Configure SLA Thresholds
            </button>
          )}

          <button 
            className="btn btn-secondary"
            onClick={handleExportCsv}
            title="Export filtered execution records as CSV"
          >
            <Icons.Download /> Export CSV
          </button>

          <button 
            className="btn btn-secondary"
            onClick={handlePrintPdf}
            title="Print or Save PDF report"
          >
            <Icons.Printer /> Print / PDF
          </button>
        </div>
      </div>

      {/* 1. REPORTS DASHBOARD: 6 DYNAMIC KPI CARDS */}
      <div className="reports-kpi-grid">
        {/* KPI 1: Total Jobs Executed */}
        <div 
          className={`kpi-card clickable ${kpiFilterFocus === null ? 'active-kpi' : ''}`}
          onClick={() => setKpiFilterFocus(null)}
          title="Click to view all execution records"
        >
          <div className="kpi-top">
            <span className="kpi-title">Total Jobs Executed</span>
            <div className="kpi-icon-wrap blue"><Icons.Jobs /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.totalExecuted}</span>
            <span className="kpi-delta positive">Active Registry</span>
          </div>
          <span className="kpi-subtext">Across {domainFilter === 'all' ? '5 domains' : domainFilter}</span>
        </div>

        {/* KPI 2: Job Success Rate */}
        <div 
          className={`kpi-card clickable ${kpiFilterFocus === 'success' ? 'active-kpi' : ''}`}
          onClick={() => setKpiFilterFocus(kpiFilterFocus === 'success' ? null : 'success')}
          title="Click to filter successful batch jobs"
        >
          <div className="kpi-top">
            <span className="kpi-title">Job Success Rate</span>
            <div className="kpi-icon-wrap green"><Icons.Check /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.successRate}</span>
            <span className="kpi-delta positive">Target: &gt;95.0%</span>
          </div>
          <span className="kpi-subtext">{filteredJobs.filter(j => j.status === 'success').length} healthy executions</span>
        </div>

        {/* KPI 3: Job Failure Rate */}
        <div 
          className={`kpi-card clickable ${kpiFilterFocus === 'failed' ? 'active-kpi' : ''}`}
          onClick={() => setKpiFilterFocus(kpiFilterFocus === 'failed' ? null : 'failed')}
          title="Click to filter failed jobs"
        >
          <div className="kpi-top">
            <span className="kpi-title">Job Failure Rate</span>
            <div className="kpi-icon-wrap red"><Icons.Failure /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.failureRate}</span>
            <span className="kpi-delta negative">{kpis.failedJobsCount} Failed</span>
          </div>
          <span className="kpi-subtext">Click to isolate root causes</span>
        </div>

        {/* KPI 4: Average Execution Duration */}
        <div 
          className={`kpi-card clickable ${activeChartTab === 'duration' ? 'active-kpi' : ''}`}
          onClick={() => setActiveChartTab('duration')}
          title="Click to view execution duration trends"
        >
          <div className="kpi-top">
            <span className="kpi-title">Avg Execution Duration</span>
            <div className="kpi-icon-wrap blue"><Icons.Clock /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.avgDuration}</span>
            <span className="kpi-delta positive">Limit: {thresholds.defaultLimitMinutes}m</span>
          </div>
          <span className="kpi-subtext">Calculated from completed tasks</span>
        </div>

        {/* KPI 5: SLA Compliance Rate */}
        <div 
          className={`kpi-card clickable ${kpiFilterFocus === 'met' ? 'active-kpi' : ''}`}
          onClick={() => {
            setKpiFilterFocus(kpiFilterFocus === 'met' ? null : 'met');
            setActiveChartTab('compliance');
          }}
          title="Click to inspect SLA compliance trends"
        >
          <div className="kpi-top">
            <span className="kpi-title">SLA Compliance Rate</span>
            <div className="kpi-icon-wrap green"><Icons.ShieldCheck /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.slaComplianceRate}</span>
            <span className="kpi-delta positive">Target: {thresholds.targetCompliancePct}%</span>
          </div>
          <span className="kpi-subtext">{kpis.metJobsCount} jobs completed on-time</span>
        </div>

        {/* KPI 6: Delayed Jobs */}
        <div 
          className={`kpi-card clickable ${kpiFilterFocus === 'delayed' ? 'active-kpi' : ''}`}
          onClick={() => setKpiFilterFocus(kpiFilterFocus === 'delayed' ? null : 'delayed')}
          title="Click to filter delayed & breached jobs"
        >
          <div className="kpi-top">
            <span className="kpi-title">Delayed & Overrun Jobs</span>
            <div className="kpi-icon-wrap red"><Icons.Clock /></div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{kpis.delayedJobsCount}</span>
            <span className="kpi-delta negative">Requires Attention</span>
          </div>
          <span className="kpi-subtext">Missed SLA target delivery</span>
        </div>
      </div>

      {/* 5. REPORT FILTERS BAR */}
      <div className="reports-filter-bar">
        <div className="reports-filter-top-row">
          <div className="reports-filter-inputs">
            {/* Search Filter */}
            <div style={{ position: 'relative', width: 220 }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search job name, ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 28, height: 32, fontSize: 12 }}
              />
              <span style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)' }}>
                <Icons.Search />
              </span>
            </div>

            {/* Date Range Filter */}
            <select 
              className="form-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: 140, height: 32, fontSize: 12 }}
            >
              <option value="today">Today (Hourly)</option>
              <option value="7d">Last 7 Days</option>
              <option value="14d">Last 14 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Workflow / Domain Filter */}
            <select 
              className="form-select"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{ width: 170, height: 32, fontSize: 12 }}
            >
              <option value="all">All Domains (5)</option>
              <option value="Financial Settlement">Financial Settlement</option>
              <option value="Risk & Compliance">Risk & Compliance</option>
              <option value="Customer 360">Customer 360</option>
              <option value="Data Platform">Data Platform</option>
              <option value="Supply Chain">Supply Chain</option>
            </select>

            {/* Execution Status Filter */}
            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 150, height: 32, fontSize: 12 }}
            >
              <option value="all">All Execution Status</option>
              <option value="success">Success Only</option>
              <option value="failed">Failed Only</option>
              <option value="delayed">Delayed Only</option>
              <option value="running">Running Only</option>
            </select>

            {/* SLA Status Filter */}
            <select 
              className="form-select"
              value={slaStatusFilter}
              onChange={(e) => setSlaStatusFilter(e.target.value)}
              style={{ width: 150, height: 32, fontSize: 12 }}
            >
              <option value="all">All SLA Statuses</option>
              <option value="Met">SLA Met (Green)</option>
              <option value="At Risk">SLA At Risk (Orange)</option>
              <option value="Breached">SLA Breached (Red)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
              title="Reset all filters to defaults"
            >
              <Icons.Refresh /> Reset Filters
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Showing {filteredJobs.length} of {jobs.length} jobs
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTION ANALYTICS (CHART SWITCHER + DOMAIN RELIABILITY) */}
      <div className="analytics-section-card">
        <div className="analytics-header">
          <div>
            <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>Batch Execution & SLA Intelligence</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {activeChartTab === 'volume' && "Volume of Successful, Delayed, and Failed jobs across the selected date range"}
              {activeChartTab === 'compliance' && `Historical SLA Compliance % trend tracked against ${thresholds.targetCompliancePct}% commitment line`}
              {activeChartTab === 'duration' && `Execution duration trends compared against the ${thresholds.defaultLimitMinutes}-minute completion ceiling`}
              {activeChartTab === 'failures' && "Top failing batch jobs and recurring bottleneck processes"}
            </div>
          </div>

          <div className="chart-tabs-group">
            <button 
              className={`chart-tab-btn ${activeChartTab === 'volume' ? 'active' : ''}`}
              onClick={() => setActiveChartTab('volume')}
            >
              <Icons.Dashboard /> Daily Volume
            </button>
            <button 
              className={`chart-tab-btn ${activeChartTab === 'compliance' ? 'active' : ''}`}
              onClick={() => setActiveChartTab('compliance')}
            >
              <Icons.ShieldCheck /> SLA Compliance
            </button>
            <button 
              className={`chart-tab-btn ${activeChartTab === 'duration' ? 'active' : ''}`}
              onClick={() => setActiveChartTab('duration')}
            >
              <Icons.Clock /> Duration Trends
            </button>
            <button 
              className={`chart-tab-btn ${activeChartTab === 'failures' ? 'active' : ''}`}
              onClick={() => setActiveChartTab('failures')}
            >
              <Icons.Failure /> Top Failing Jobs
            </button>
          </div>
        </div>

        <div className="analytics-body-grid">
          {/* Main Interactive Chart.js Canvas */}
          <div className="chart-canvas-wrapper">
            <canvas ref={canvasRef}></canvas>
          </div>

          {/* Workflow & Domain Reliability Index */}
          <div className="domain-reliability-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Workflow Reliability Index
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target: &gt;98%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {domainReliability.map(item => (
                <div 
                  key={item.domain} 
                  className="domain-reliability-item"
                  onClick={() => setDomainFilter(domainFilter === item.domain ? 'all' : item.domain)}
                  title={`Click to filter jobs for domain: ${item.domain}`}
                >
                  <div className="domain-item-top">
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.domain}</span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: item.status === 'Met' ? '#10b981' : (item.status === 'At Risk' ? '#f59e0b' : '#ef4444') 
                    }}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="domain-progress-bar-bg">
                    <div 
                      className="domain-progress-fill" 
                      style={{ 
                        width: `${item.score}%`, 
                        backgroundColor: item.status === 'Met' ? '#10b981' : (item.status === 'At Risk' ? '#f59e0b' : '#ef4444') 
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.count} registered batch workflows</span>
                    <span className={`sla-badge ${item.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SLA MONITORING TABLE */}
      <div className="sla-table-card">
        <div className="sla-table-header">
          <div>
            <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>Batch SLA Compliance Registry</strong>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Target vs actual durations, SLA margins, and breach indicators. Click any record to inspect root cause & downstream impact.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Legend: 
            </span>
            <span className="sla-badge met">✓ Met</span>
            <span className="sla-badge at-risk">⚠ At Risk</span>
            <span className="sla-badge breached">✕ Breached</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Name & Identifier</th>
                <th>Target Completion Time</th>
                <th>Actual Duration</th>
                <th>SLA Status</th>
                <th>Delay / Buffer Margin</th>
                <th>Last Execution</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                    No batch jobs match the selected filter criteria. <button className="btn btn-secondary btn-sm" style={{ marginLeft: 8 }} onClick={handleResetFilters}>Reset Filters</button>
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr 
                    key={job.id} 
                    className="sla-row-clickable"
                    onClick={() => setSelectedSlaJob(job)}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <strong style={{ color: 'var(--text-primary)', fontSize: 12.5 }}>{job.name}</strong>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'JetBrains Mono' }}>{job.id}</span>
                          <span>•</span>
                          <span className="role-tag" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                            {job.domain}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="sla-target-meter">
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 12 }}>
                          {job.slaLimit || `${thresholds.defaultLimitMinutes}m 00s`}
                        </span>
                        <div className="sla-meter-bar" title={`${job.pctConsumed}% of SLA window elapsed`}>
                          <div 
                            className="sla-meter-fill"
                            style={{ 
                              width: `${Math.min(job.pctConsumed, 100)}%`,
                              backgroundColor: job.slaStatus === 'Met' ? '#10b981' : (job.slaStatus === 'At Risk' ? '#f59e0b' : '#ef4444')
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                          {job.duration}
                        </span>
                        <span className={`status-pill ${job.status}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                          {job.status}
                        </span>
                      </div>
                    </td>

                    <td>
                      {job.slaStatus === 'Met' && (
                        <span className="sla-badge met">
                          <Icons.Check /> Met
                        </span>
                      )}
                      {job.slaStatus === 'At Risk' && (
                        <span className="sla-badge at-risk">
                          <Icons.Clock /> At Risk
                        </span>
                      )}
                      {job.slaStatus === 'Breached' && (
                        <span className="sla-badge breached">
                          <Icons.Cross /> Breached
                        </span>
                      )}
                    </td>

                    <td>
                      <span style={{ 
                        fontFamily: 'JetBrains Mono', 
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: job.isOverrun ? '#ef4444' : (job.slaStatus === 'At Risk' ? '#f59e0b' : '#10b981')
                      }}>
                        {job.delayMargin}
                      </span>
                    </td>

                    <td style={{ color: 'var(--text-muted)', fontSize: 11.5 }}>
                      {job.lastRun}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlaJob(job);
                        }}
                      >
                        Inspect SLA →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SLA DETAILS DRAWER */}
      {selectedSlaJob && (
        <div className="sla-drawer-overlay" onClick={() => setSelectedSlaJob(null)}>
          <div className="sla-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="sla-drawer-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`status-pill ${selectedSlaJob.status}`}>
                    {selectedSlaJob.status}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>
                    {selectedSlaJob.id}
                  </span>
                  <span className="role-tag" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                    {selectedSlaJob.domain}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedSlaJob.name}
                </h3>
              </div>

              <button 
                className="action-btn-mini" 
                onClick={() => setSelectedSlaJob(null)}
                title="Close drawer"
              >
                <Icons.Cross />
              </button>
            </div>

            <div className="sla-drawer-body">
              {/* SLA Target vs Actual Completion Box */}
              <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      SLA Performance Gauge
                    </span>
                    <span className={`sla-badge ${selectedSlaJob.slaStatus.toLowerCase().replace(' ', '-')}`}>
                      {selectedSlaJob.slaStatus}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SLA Target Limit</div>
                      <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>
                        {selectedSlaJob.slaLimit || `${thresholds.defaultLimitMinutes}m 00s`}
                      </strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Actual Runtime</div>
                      <strong style={{ fontSize: 15, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono' }}>
                        {selectedSlaJob.duration}
                      </strong>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Variance Margin</div>
                      <strong style={{ 
                        fontSize: 13.5, 
                        color: selectedSlaJob.isOverrun ? '#ef4444' : '#10b981',
                        fontFamily: 'JetBrains Mono' 
                      }}>
                        {selectedSlaJob.delayMargin}
                      </strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Time Window Consumed</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedSlaJob.pctConsumed}%</strong>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${Math.min(selectedSlaJob.pctConsumed, 100)}%`,
                          height: '100%',
                          backgroundColor: selectedSlaJob.slaStatus === 'Met' ? '#10b981' : (selectedSlaJob.slaStatus === 'At Risk' ? '#f59e0b' : '#ef4444')
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance History (Last 7 Runs) */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  Historical SLA Compliance (Last 7 Runs)
                </span>
                <div className="sla-history-timeline">
                  {generateJobRunHistory(selectedSlaJob, selectedSlaJob.slaStatus).map(run => (
                    <div key={run.run} className="sla-history-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--text-primary)' }}>{run.run}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{run.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>{run.dur}</span>
                        <span className={`status-pill ${run.status}`} style={{ fontSize: 9.5, padding: '1px 5px' }}>{run.status}</span>
                        <span className={`sla-badge ${run.sla.toLowerCase().replace(' ', '-')}`} style={{ fontSize: 9.5, padding: '1px 6px' }}>{run.sla}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failure / Overrun Reason if applicable */}
              {(selectedSlaJob.status === 'failed' || selectedSlaJob.status === 'delayed' || selectedSlaJob.slaStatus === 'Breached') && (
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Failure Diagnostic & SLA Root Cause
                  </span>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: '#991b1b', fontFamily: 'JetBrains Mono' }}>
                    {getRemediationPlaybook(selectedSlaJob, selectedSlaJob.slaStatus).reason}
                  </div>
                </div>
              )}

              {/* Affected Downstream Workflows */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  Downstream Workflows Dependent on this Batch ({selectedSlaJob.dependenciesCount?.down || 1})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="card" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <div className="card-body" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>
                          BJ-1101: Executive Daily P&L Dashboard Aggregator
                        </strong>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Consumes: gl_daily_ledger_partition • Impact: {selectedSlaJob.isOverrun ? 'Delayed (+18m lag)' : 'Normal'}
                        </div>
                      </div>
                      <span className={`status-pill ${selectedSlaJob.isOverrun ? 'delayed' : 'queued'}`}>
                        {selectedSlaJob.isOverrun ? 'Lagging' : 'Waiting'}
                      </span>
                    </div>
                  </div>

                  <div className="card" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <div className="card-body" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>
                          BJ-1098: Customer Statement Email Dispatcher
                        </strong>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Consumes: processed_transactions_stream • Impact: {selectedSlaJob.isOverrun ? 'Held in Queue' : 'Normal'}
                        </div>
                      </div>
                      <span className={`status-pill ${selectedSlaJob.isOverrun ? 'delayed' : 'queued'}`}>
                        {selectedSlaJob.isOverrun ? 'Queue Block' : 'Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Corrective Action */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Recommended Corrective Action
                </span>
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--primary)', marginTop: 2 }}><Icons.ShieldCheck /></span>
                    <div>
                      {getRemediationPlaybook(selectedSlaJob, selectedSlaJob.slaStatus).action}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sla-drawer-footer">
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedSlaJob(null)}
              >
                Close Drawer
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const targetJob = selectedSlaJob;
                    setSelectedSlaJob(null);
                    if (onOpenJob) {
                      onOpenJob(targetJob);
                    } else {
                      navigate(`/jobs/${targetJob.id}`);
                    }
                  }}
                >
                  <Icons.Jobs /> Inspect in Job Monitor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADMIN SLA THRESHOLD CONFIGURATION MODAL */}
      {isAdmin && isThresholdModalOpen && (
        <div className="modal-overlay" onClick={() => setIsThresholdModalOpen(false)}>
          <div className="admin-threshold-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  Configure Enterprise SLA Thresholds (Admin)
                </strong>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Adjust SLA compliance commitment targets, warning thresholds, and default batch limits.
                </div>
              </div>
              <button className="action-btn-mini" onClick={() => setIsThresholdModalOpen(false)}>
                <Icons.Cross />
              </button>
            </div>

            <form onSubmit={handleSaveThresholds}>
              <div className="admin-threshold-modal-body">
                <div className="form-group">
                  <label className="form-label">Target SLA Commitment Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="50" 
                    max="100" 
                    className="form-input" 
                    value={tempThresholds.targetCompliancePct} 
                    onChange={e => setTempThresholds({ ...tempThresholds, targetCompliancePct: e.target.value })} 
                    required 
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                    Enterprise SLA target displayed on dashboard KPI cards and reference compliance charts (e.g. 98.5%).
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Warning Threshold (% of completion limit)</label>
                  <input 
                    type="number" 
                    step="1" 
                    min="10" 
                    max="99" 
                    className="form-input" 
                    value={tempThresholds.warningThresholdPct} 
                    onChange={e => setTempThresholds({ ...tempThresholds, warningThresholdPct: e.target.value })} 
                    required 
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                    Jobs that consume more than this percentage of their SLA target duration will be classified as <strong>At Risk</strong>.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Batch Completion Ceiling (Minutes)</label>
                  <input 
                    type="number" 
                    step="1" 
                    min="1" 
                    max="480" 
                    className="form-input" 
                    value={tempThresholds.defaultLimitMinutes} 
                    onChange={e => setTempThresholds({ ...tempThresholds, defaultLimitMinutes: e.target.value })} 
                    required 
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                    Standard fallback SLA completion limit applied when a specific batch job definition does not define a custom limit.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsThresholdModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save SLA Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// REUSABLE ENTERPRISE BACK BUTTON
// =========================================================================
function BackButton({ fallback = "/dashboard", label = "Back" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button 
      className="back-btn" 
      onClick={handleBack} 
      type="button" 
      title="Return to previous page"
    >
      <Icons.ArrowLeft />
      <span>← {label}</span>
    </button>
  );
}

// =========================================================================
// SECONDARY DETAIL VIEW: JOB DETAILS PAGE (/jobs/:id)
// =========================================================================
function JobDetailPage({ jobs, onRun, onRetry, isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!job) {
    return (
      <div className="detail-page-container">
        <BackButton fallback="/jobs" label="Back to Job Monitoring" />
        <div className="card">
          <div className="card-body" style={{ padding: 40, textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Job Not Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>The batch job "{id}" does not exist in the active cluster registry.</p>
            <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Return to Job Registry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page-container">
      <div>
        <BackButton fallback="/jobs" label="Back to Job Monitoring" />
        <div className="detail-hero-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className={`status-pill ${job.status}`}>{job.status}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{job.id}</span>
              <span className="role-tag" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>{job.domain}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{job.name}</h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
              Scheduled on {job.cluster} • Assigned to <code>{job.worker}</code>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {job.status === 'failed' ? (
              <button className="btn btn-danger" onClick={() => onRetry(job.id)}>
                <Icons.Refresh /> Retry Failed Task
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => onRun(job.id)}>
                <Icons.Play /> Trigger Run Now
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => navigate('/dependencies')}>
              <Icons.Map /> View in Dependency Map
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div style={{ display: 'flex', gap: 6, padding: '12px 16px 0 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
          {[
            { id: 'overview', label: 'Overview & SLA Metrics' },
            { id: 'logs', label: 'Terminal Logs' },
            { id: 'history', label: 'Execution History' },
            { id: 'dependencies', label: 'Upstream & Downstream Jobs' }
          ].map(t => (
            <button
              key={t.id}
              className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none', fontWeight: 600 }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card-body">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {job.status === 'failed' && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, padding: '12px 14px' }}>
                  <strong style={{ color: '#991b1b', fontSize: 12.5, display: 'block' }}>Failure Diagnostic:</strong>
                  <div style={{ fontSize: 12, color: '#7f1d1d', marginTop: 4, fontFamily: 'JetBrains Mono' }}>
                    {job.failureReason}
                  </div>
                </div>
              )}

              <div className="detail-grid">
                <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="card-body">
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>SLA Target & Runtime</span>
                    <strong style={{ fontSize: 16, color: 'var(--text-primary)', marginTop: 2, display: 'block' }}>
                      {job.duration} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>/ Limit: {job.slaLimit}</span>
                    </strong>
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                      Tier Classification: <strong>{job.slaTier}</strong>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="card-body">
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Processed Records</span>
                    <strong style={{ fontSize: 16, color: 'var(--text-primary)', marginTop: 2, display: 'block' }}>
                      {job.records}
                    </strong>
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                      Execution Priority: <strong>{job.priority}</strong>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="card-body">
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Cron Schedule</span>
                    <strong style={{ fontSize: 14, color: 'var(--text-primary)', marginTop: 2, display: 'block', fontFamily: 'JetBrains Mono' }}>
                      {job.schedule}
                    </strong>
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                      Next Window: <strong>{job.nextRun}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="terminal-compact" style={{ maxHeight: 350, overflowY: 'auto' }}>
              {JOB_LOGS_SAMPLE.map((l, i) => (
                <div key={i} style={{ padding: '2px 0', wordBreak: 'break-all' }}>
                  <span style={{ color: '#64748b' }}>{l.time}</span> <span style={{ color: l.level === 'ERROR' ? '#f87171' : l.level === 'WARN' ? '#fbbf24' : '#60a5fa' }}>[{l.level}]</span> {l.msg}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { run: "#948210", start: "2026-09-29 04:00:00", dur: "28m 01s", status: job.status },
                { run: "#948209", start: "2026-09-28 04:00:00", dur: "25m 12s", status: "success" },
                { run: "#948208", start: "2026-09-27 04:00:00", dur: "23m 44s", status: "success" }
              ].map((h, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: 6, fontSize: 12 }}>
                  <span><strong>{h.run}</strong> • Started {h.start}</span>
                  <span className={`status-pill ${h.status}`}>{h.status} ({h.dur})</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Upstream Prerequisites ({job.dependenciesCount.up})
                </span>
                <div 
                  className="card"
                  style={{ marginTop: 6, cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => navigate('/jobs/BJ-1092')}
                >
                  <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
                    <div>
                      <strong>BJ-1092: Core Banking Transaction Sync</strong>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Partition Output: transactions_delta_partition</div>
                    </div>
                    <span className="btn btn-secondary btn-sm">Inspect Job →</span>
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Downstream Consumers ({job.dependenciesCount.down})
                </span>
                <div 
                  className="card"
                  style={{ marginTop: 6, cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => navigate('/jobs/BJ-1101')}
                >
                  <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
                    <div>
                      <strong>BJ-1101: Executive Daily P&L Dashboard</strong>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Consumes Dataset: gl_balance_summary</div>
                    </div>
                    <span className="btn btn-secondary btn-sm">Inspect Job →</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SECONDARY DETAIL VIEW: ALERT DETAILS PAGE (/alerts/:id)
// =========================================================================
function AlertDetailPage({ alerts, onAcknowledge, onResolve }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = alerts.find(a => a.id === id);

  if (!alert) {
    return (
      <div className="detail-page-container">
        <BackButton fallback="/alerts" label="Back to Alerts" />
        <div className="card">
          <div className="card-body" style={{ padding: 40, textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Alert Not Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>The requested alert "{id}" could not be found.</p>
            <button className="btn btn-primary" onClick={() => navigate('/alerts')}>Return to Alerts</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page-container">
      <div>
        <BackButton fallback="/alerts" label="Back to Alerts" />
        <div className="detail-hero-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className={`status-pill ${alert.severity === 'Critical' ? 'failed' : 'delayed'}`}>
                {alert.severity}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{alert.id}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reported at {alert.time}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{alert.title}</h2>
            <div style={{ marginTop: 6, fontSize: 12 }}>
              Status: <strong style={{ textTransform: 'capitalize', color: alert.status === 'resolved' ? '#15803d' : alert.status === 'acknowledged' ? '#b45309' : '#b91c1c' }}>{alert.status}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {alert.status === 'active' && (
              <button className="btn btn-secondary" onClick={() => onAcknowledge(alert.id)}>
                Acknowledge Alert
              </button>
            )}
            {alert.status !== 'resolved' && (
              <button className="btn btn-primary" onClick={() => onResolve(alert.id)}>
                <Icons.Check /> Resolve Incident
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Affected Batch Job</div>
        </div>
        <div className="card-body">
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'var(--bg-subtle)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 6, 
              padding: '12px 16px',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/jobs/${alert.jobId}`)}
          >
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TARGET JOB RUNNER</div>
              <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{alert.jobName} ({alert.jobId})</strong>
              <div style={{ fontSize: 11.5, color: 'var(--primary)', marginTop: 2 }}>Click to inspect job details and timeline →</div>
            </div>
            <button className="btn btn-secondary btn-sm">Inspect Job</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Incident Analysis & Mitigation</div>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Root Cause & Symptoms</span>
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: 'var(--text-primary)' }}>
              {alert.reason}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Recommended Remediation Playbook</span>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: '#1e40af' }}>
              {alert.recommendedAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// PROFILE PICTURE CROP & ADJUSTMENT MODAL COMPONENT
// =========================================================================
function ProfilePhotoCropModal({
  isOpen,
  onClose,
  imageSrc,
  fileName = "photo.jpg",
  fileSize = "",
  onSave,
  onChangeFile
}) {
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const imageObjRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageObjRef.current = img;
      setImageLoaded(true);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!isOpen || !imageLoaded || !imageObjRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const img = imageObjRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const cropDiameter = 220;
    const baseScale = Math.max(cropDiameter / img.width, cropDiameter / img.height);
    const finalScale = baseScale * zoom;

    ctx.scale(finalScale, finalScale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Dark outer mask with circular cutout
    const cropRadius = cropDiameter / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.arc(centerX, centerY, cropRadius, 0, Math.PI * 2, true);
    ctx.fill();

    // Circle ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, cropRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Rule of thirds subtle grid inside circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, cropRadius - 1, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    const step = cropDiameter / 3;
    ctx.beginPath();
    ctx.moveTo(centerX - cropRadius + step, centerY - cropRadius);
    ctx.lineTo(centerX - cropRadius + step, centerY + cropRadius);
    ctx.moveTo(centerX - cropRadius + step * 2, centerY - cropRadius);
    ctx.lineTo(centerX - cropRadius + step * 2, centerY + cropRadius);
    ctx.moveTo(centerX - cropRadius, centerY - cropRadius + step);
    ctx.lineTo(centerX + cropRadius, centerY - cropRadius + step);
    ctx.moveTo(centerX - cropRadius, centerY - cropRadius + step * 2);
    ctx.lineTo(centerX + cropRadius, centerY - cropRadius + step * 2);
    ctx.stroke();
    ctx.restore();

    // Update live circular preview thumbnail
    if (previewCanvasRef.current) {
      const pCanvas = previewCanvasRef.current;
      const pCtx = pCanvas.getContext('2d');
      const pW = pCanvas.width;
      const pH = pCanvas.height;

      pCtx.clearRect(0, 0, pW, pH);
      pCtx.save();
      pCtx.beginPath();
      pCtx.arc(pW / 2, pH / 2, pW / 2, 0, Math.PI * 2);
      pCtx.clip();

      pCtx.translate(pW / 2 + (pan.x * (pW / cropDiameter)), pH / 2 + (pan.y * (pH / cropDiameter)));
      pCtx.rotate((rotation * Math.PI) / 180);
      const pScale = (baseScale * zoom) * (pW / cropDiameter);
      pCtx.scale(pScale, pScale);
      pCtx.drawImage(img, -img.width / 2, -img.height / 2);
      pCtx.restore();
    }
  }, [isOpen, imageLoaded, zoom, rotation, pan]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const handleSaveCropped = () => {
    if (!imageObjRef.current) return;
    const img = imageObjRef.current;
    const outSize = 300;
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outSize;
    outCanvas.height = outSize;
    const outCtx = outCanvas.getContext('2d');

    const cropDiameter = 220;
    const baseScale = Math.max(cropDiameter / img.width, cropDiameter / img.height);
    const finalScale = (baseScale * zoom) * (outSize / cropDiameter);

    outCtx.save();
    outCtx.translate(outSize / 2 + (pan.x * (outSize / cropDiameter)), outSize / 2 + (pan.y * (outSize / cropDiameter)));
    outCtx.rotate((rotation * Math.PI) / 180);
    outCtx.scale(finalScale, finalScale);
    outCtx.drawImage(img, -img.width / 2, -img.height / 2);
    outCtx.restore();

    const croppedDataUrl = outCanvas.toDataURL('image/jpeg', 0.92);
    onSave(croppedDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="crop-modal-overlay" onClick={onClose}>
      <div className="crop-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-header">
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Adjust & Crop Profile Picture
            </h3>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              {fileName} {fileSize ? `(${fileSize})` : ''} • Drag to center • Zoom to frame
            </span>
          </div>
          <button type="button" className="action-btn-mini" onClick={onClose} title="Close modal">
            <Icons.Cross />
          </button>
        </div>

        <div className="crop-modal-body">
          <div className="crop-canvas-container">
            <div 
              className="crop-canvas-wrapper"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <canvas ref={canvasRef} width={280} height={280} style={{ display: 'block' }} />
              <div className="crop-drag-hint">Drag image to adjust position</div>
            </div>

            <div className="crop-preview-thumb-box">
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Live Preview
              </span>
              <div className="crop-preview-circle">
                <canvas ref={previewCanvasRef} width={76} height={76} style={{ display: 'block' }} />
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 100 }}>
                Navbar & profile display
              </span>
            </div>
          </div>

          <div className="crop-controls-row">
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', minWidth: 46 }}>
              Zoom:
            </span>
            <input 
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: 11.5, fontFamily: 'monospace', color: 'var(--text-muted)', minWidth: 36 }}>
              {zoom.toFixed(1)}x
            </span>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleRotate}
              title="Rotate 90 degrees"
            >
              <Icons.RotateCcw /> Rotate
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
              title="Reset position and zoom"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="crop-modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onChangeFile}
          >
            <Icons.Camera /> Choose Different Photo
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSaveCropped}
              id="btn-confirm-save-photo"
            >
              <Icons.Check /> Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// ENTERPRISE SETTINGS VIEW (APPEARANCE, PREFERENCES, PROFILE, BRAND, USERS)
// =========================================================================
function SettingsView({
  currentUser,
  setCurrentUser,
  appName,
  onSaveAppName,
  theme,
  onSetTheme,
  preferences,
  onSavePreferences,
  onSaveProfile,
  onSaveProfilePhoto,
  users,
  onUpdateUsers,
  activeTab = 'appearance',
  showToast
}) {
  const navigate = useNavigate();
  const isAdmin = currentUser && currentUser.role === 'admin';

  // File Input Ref and Crop Modal State for Profile Picture
  const fileInputRef = useRef(null);
  const [cropModal, setCropModal] = useState({
    open: false,
    imageSrc: null,
    fileName: "",
    fileSize: ""
  });

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (limit 5 MB = 5 * 1024 * 1024 bytes)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast("error", `File size ${(file.size / (1024 * 1024)).toFixed(1)} MB exceeds the 5 MB limit.`);
      e.target.value = '';
      return;
    }

    // Validate format (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['jpg', 'jpeg', 'png', 'webp'];
    if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
      showToast("error", "Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result;
      if (dataUrl) {
        setCropModal({
          open: true,
          imageSrc: dataUrl,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(0)} KB`
        });
      }
    };
    reader.onerror = () => {
      showToast("error", "Failed to read the selected image file.");
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAdjustExisting = () => {
    if (!currentUser?.avatarUrl) return;
    setCropModal({
      open: true,
      imageSrc: currentUser.avatarUrl,
      fileName: "Current Profile Picture",
      fileSize: ""
    });
  };

  const handleRemovePhoto = () => {
    if (window.confirm("Are you sure you want to remove your custom profile picture? Your default initials will be displayed.")) {
      if (onSaveProfilePhoto) {
        onSaveProfilePhoto(null);
      }
    }
  };

  const handleSaveCroppedPhoto = (croppedDataUrl) => {
    if (onSaveProfilePhoto) {
      onSaveProfilePhoto(croppedDataUrl);
    }
    setCropModal(prev => ({ ...prev, open: false }));
  };

  // Normalize tab
  const tabSafe = (!isAdmin && (activeTab === 'brand' || activeTab === 'users')) ? 'appearance' : activeTab;

  // Local preferences state
  const [localPrefs, setLocalPrefs] = useState({ ...preferences });
  useEffect(() => {
    setLocalPrefs({ ...preferences });
  }, [preferences]);

  // Local profile state
  const [profileName, setProfileName] = useState(currentUser ? currentUser.name : "");
  const [profileEmail, setProfileEmail] = useState(currentUser ? currentUser.email : "");
  const [profileAvatarColor, setProfileAvatarColor] = useState(currentUser ? (currentUser.avatarColor || "#0b3334") : "#0b3334");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwdFields, setShowPwdFields] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
      setProfileAvatarColor(currentUser.avatarColor || "#0b3334");
    }
  }, [currentUser]);

  // Local admin brand name state
  const [brandInput, setBrandInput] = useState(appName);
  useEffect(() => {
    setBrandInput(appName);
  }, [appName]);

  // Local user management state
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModal, setEditUserModal] = useState(null);
  const [resetPwdModal, setResetPwdModal] = useState(null);
  const [tempPassword, setTempPassword] = useState("");
  const [copiedPwd, setCopiedPwd] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [newUserDept, setNewUserDept] = useState("Operations");
  const [newUserAvatarColor, setNewUserAvatarColor] = useState("#0b3334");

  const avatarColorOptions = [
    '#0b3334', '#0f766e', '#2563eb', '#4f46e5',
    '#7c3aed', '#d97706', '#dc2626', '#1e293b'
  ];

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    onSavePreferences(localPrefs);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (newPwd.trim()) {
      if (!currentPwd.trim()) {
        showToast("error", "Current password required to set a new password.");
        return;
      }
      if (newPwd.length < 6) {
        showToast("error", "New password must be at least 6 characters.");
        return;
      }
      if (newPwd !== confirmPwd) {
        showToast("error", "New passwords do not match.");
        return;
      }
    }

    const success = onSaveProfile({
      name: profileName,
      email: profileEmail,
      avatarColor: profileAvatarColor,
      newPassword: newPwd.trim() ? newPwd.trim() : null
    });

    if (success) {
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }
  };

  const handleSaveBrand = (e) => {
    e.preventDefault();
    if (!brandInput.trim()) {
      showToast("error", "Application name cannot be empty.");
      return;
    }
    onSaveAppName(brandInput.trim());
  };

  const handleResetBrand = () => {
    setBrandInput("Stawhats");
    onSaveAppName("Stawhats");
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast("error", "Name and email are required.");
      return;
    }

    const created = {
      id: `USR-0${users.length + 1}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept.trim() || "Operations",
      status: "Active",
      lastLogin: "Never",
      avatarColor: newUserAvatarColor
    };

    onUpdateUsers([...users, created]);
    setAddUserModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    showToast("success", `User ${created.name} created.`);
  };

  const handleSaveEditedUser = (e) => {
    e.preventDefault();
    if (!editUserModal) return;

    onUpdateUsers(users.map(u => u.id === editUserModal.id ? editUserModal : u));
    setEditUserModal(null);
    showToast("success", `Updated user ${editUserModal.name}.`);
  };

  const toggleUserStatus = (id) => {
    onUpdateUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast("info", "User status updated.");
  };

  const toggleUserRole = (id) => {
    onUpdateUsers(users.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
    showToast("info", "User role permission changed.");
  };

  const handleDeleteUser = (userToDelete) => {
    if (userToDelete.email === currentUser.email) {
      showToast("error", "You cannot delete your currently active account.");
      return;
    }
    if (confirm(`Are you sure you want to permanently delete user ${userToDelete.name}?`)) {
      onUpdateUsers(users.filter(u => u.id !== userToDelete.id));
      showToast("info", `User ${userToDelete.name} removed.`);
    }
  };

  const openResetPasswordModal = (targetUser) => {
    const generated = `TempPass-${Math.floor(1000 + Math.random() * 9000)}!`;
    setResetPwdModal(targetUser);
    setTempPassword(generated);
    setCopiedPwd(false);
  };

  const copyTempPassword = () => {
    navigator.clipboard?.writeText(tempPassword);
    setCopiedPwd(true);
    setTimeout(() => setCopiedPwd(false), 2500);
    showToast("success", "Temporary password copied to clipboard.");
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const isSubPage = tabSafe !== 'appearance';

  return (
    <div>
      {/* Top back button for sub-pages or admin pages */}
      {isSubPage && (
        <BackButton 
          fallback={tabSafe === 'brand' || tabSafe === 'users' ? '/dashboard' : '/settings/appearance'} 
          label={tabSafe === 'brand' || tabSafe === 'users' ? 'Back to Dashboard' : 'Back to Settings'} 
        />
      )}

      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Settings />
            {tabSafe === 'brand' ? 'Admin Brand Settings' : tabSafe === 'users' ? 'Admin User Management' : 'Application Settings'}
          </h2>
          <p>
            {tabSafe === 'appearance' && 'Manage your personal UI appearance, color theme, and display mode.'}
            {tabSafe === 'preferences' && 'Configure notifications, alerting threshold defaults, and dashboard density.'}
            {tabSafe === 'profile' && 'Update your operator display name, email, credentials, and profile avatar.'}
            {tabSafe === 'brand' && 'Customize enterprise workspace branding, application name, and system titles.'}
            {tabSafe === 'users' && 'Provision operator access, team roles, password resets, and account statuses.'}
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="settings-tabs-nav">
        <button 
          className={`settings-tab-btn ${tabSafe === 'appearance' ? 'active' : ''}`}
          onClick={() => navigate('/settings/appearance')}
          type="button"
        >
          <Icons.Sun /> Appearance
        </button>
        <button 
          className={`settings-tab-btn ${tabSafe === 'preferences' ? 'active' : ''}`}
          onClick={() => navigate('/settings/preferences')}
          type="button"
        >
          <Icons.Sliders /> User Preferences
        </button>
        <button 
          className={`settings-tab-btn ${tabSafe === 'profile' ? 'active' : ''}`}
          onClick={() => navigate('/settings/profile')}
          type="button"
        >
          <Icons.User /> Profile
        </button>

        {isAdmin && (
          <>
            <button 
              className={`settings-tab-btn ${tabSafe === 'brand' ? 'active' : ''}`}
              onClick={() => navigate('/admin/branding')}
              type="button"
            >
              <Icons.Building /> Brand & System
            </button>
            <button 
              className={`settings-tab-btn ${tabSafe === 'users' ? 'active' : ''}`}
              onClick={() => navigate('/admin/users')}
              type="button"
            >
              <Icons.Users /> User Management
            </button>
          </>
        )}
      </div>

      {/* 1. APPEARANCE TAB */}
      {tabSafe === 'appearance' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Color Theme & Visual Mode</div>
              <div className="card-subtitle">Changes apply immediately across the entire platform and persist for your user account.</div>
            </div>
          </div>
          <div className="card-body">
            <div className="theme-selector-grid">
              {/* Light Card */}
              <div 
                className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                onClick={() => onSetTheme('light')}
              >
                <div className="theme-card-preview theme-preview-light">
                  <div className="preview-sidebar"></div>
                  <div className="preview-content">
                    <div className="preview-bar"></div>
                    <div className="preview-card"></div>
                  </div>
                </div>
                <div className="theme-card-info">
                  <div>
                    <div className="theme-card-title">Light Theme</div>
                    <div className="theme-card-desc">Crisp white and slate surfaces for daytime operations</div>
                  </div>
                  {theme === 'light' && <div className="theme-check-icon">✓</div>}
                </div>
              </div>

              {/* Dark Card */}
              <div 
                className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => onSetTheme('dark')}
              >
                <div className="theme-card-preview theme-preview-dark">
                  <div className="preview-sidebar"></div>
                  <div className="preview-content">
                    <div className="preview-bar"></div>
                    <div className="preview-card"></div>
                  </div>
                </div>
                <div className="theme-card-info">
                  <div>
                    <div className="theme-card-title">Dark Theme</div>
                    <div className="theme-card-desc">Deep slate dark mode engineered for high-uptime NOC monitors</div>
                  </div>
                  {theme === 'dark' && <div className="theme-check-icon">✓</div>}
                </div>
              </div>

              {/* System Default Card */}
              <div 
                className={`theme-card ${theme === 'system' ? 'active' : ''}`}
                onClick={() => onSetTheme('system')}
              >
                <div className="theme-card-preview theme-preview-system">
                  <div className="preview-sidebar"></div>
                  <div className="preview-content">
                    <div className="preview-bar"></div>
                    <div className="preview-card"></div>
                  </div>
                </div>
                <div className="theme-card-info">
                  <div>
                    <div className="theme-card-title">System Default</div>
                    <div className="theme-card-desc">Sync automatically with your operating system preference</div>
                  </div>
                  {theme === 'system' && <div className="theme-check-icon">✓</div>}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.ShieldCheck />
              <span>
                Current theme is saved for logged-in user: <strong>{currentUser?.email}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER PREFERENCES TAB */}
      {tabSafe === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Notification & Operational Preferences</div>
                <div className="card-subtitle">Customize how batch errors, predictions, and views behave for your account.</div>
              </div>
            </div>

            <div className="card-body">
              <div className="preference-row">
                <div className="preference-info">
                  <h4>Email Notifications</h4>
                  <p>Send digest emails for critical SLA failures and completed pipeline runs.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input 
                    type="checkbox" 
                    checked={localPrefs.emailNotifications}
                    onChange={(e) => setLocalPrefs(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-row">
                <div className="preference-info">
                  <h4>Job Failure Alerts</h4>
                  <p>Trigger immediate dashboard badge alerts and audio chirps when a batch task fails.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input 
                    type="checkbox" 
                    checked={localPrefs.jobFailureAlerts}
                    onChange={(e) => setLocalPrefs(prev => ({ ...prev, jobFailureAlerts: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-row">
                <div className="preference-info">
                  <h4>Predictive Risk Alerts</h4>
                  <p>Enable machine learning warnings before an SLA breach cascades downstream.</p>
                </div>
                <label className="toggle-switch-wrap">
                  <input 
                    type="checkbox" 
                    checked={localPrefs.predictiveAlerts}
                    onChange={(e) => setLocalPrefs(prev => ({ ...prev, predictiveAlerts: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-row">
                <div className="preference-info">
                  <h4>Dashboard Layout Density</h4>
                  <p>Choose between standard comfortable spacing or high-density rows for compact screens.</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${localPrefs.dashboardDensity === 'comfortable' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setLocalPrefs(prev => ({ ...prev, dashboardDensity: 'comfortable' }))}
                  >
                    Comfortable
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${localPrefs.dashboardDensity === 'compact' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setLocalPrefs(prev => ({ ...prev, dashboardDensity: 'compact' }))}
                  >
                    Compact Density
                  </button>
                </div>
              </div>

              <div className="preference-row">
                <div className="preference-info">
                  <h4>Default Landing Page</h4>
                  <p>The screen displayed immediately after signing into your operational workspace.</p>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 220 }}
                  value={localPrefs.defaultLandingPage}
                  onChange={(e) => setLocalPrefs(prev => ({ ...prev, defaultLandingPage: e.target.value }))}
                >
                  <option value="dashboard">Dashboard (Overview)</option>
                  <option value="jobs">Job Monitoring</option>
                  <option value="dependencies">Dependency Map</option>
                  <option value="alerts">Alerts Console</option>
                  <option value="scheduler">Batch Scheduler</option>
                  <option value="reports">Reports & SLAs</option>
                </select>
              </div>

              <div className="preference-row" style={{ borderBottom: 'none' }}>
                <div className="preference-info">
                  <h4>Language & Locale</h4>
                  <p>System localization for dates, cron schedules, and operational labels.</p>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 220 }}
                  value={localPrefs.language}
                  onChange={(e) => setLocalPrefs(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English (US / International)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="fr">Français (French)</option>
                  <option value="ja">日本語 (Japanese)</option>
                </select>
              </div>
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setLocalPrefs({
                  emailNotifications: true,
                  jobFailureAlerts: true,
                  predictiveAlerts: true,
                  dashboardDensity: 'comfortable',
                  defaultLandingPage: 'dashboard',
                  language: 'en'
                })}
              >
                Reset to Defaults
              </button>
              <button type="submit" className="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. PROFILE TAB */}
      {tabSafe === 'profile' && (
        <form onSubmit={handleProfileSubmit}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Operator Profile & Credentials</div>
                <div className="card-subtitle">Manage your personal identification, display avatar, and account password.</div>
              </div>
            </div>

            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 14 }}>
                <label className="form-label">Role Permission Level</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <span className={`role-tag ${currentUser?.role}`} style={{ fontSize: 11, padding: '3px 8px' }}>
                    {currentUser?.role?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {currentUser?.role === 'admin' 
                      ? 'Full platform administrator with permission to edit system brand and manage team operators.' 
                      : 'Operator role with job monitoring, DAG inspection, and alerts resolution permissions.'}
                  </span>
                </div>
              </div>

              {/* Profile Picture & Avatar Section */}
              <div className="profile-photo-card" style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                      Profile Picture & Avatar
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Upload a custom portrait or team photo. Displayed in the top navigation bar, profile settings, and system audits.
                    </p>
                  </div>
                  <span className={`status-pill ${currentUser?.avatarUrl ? 'status-pill-success' : 'status-pill-neutral'}`}>
                    {currentUser?.avatarUrl ? '● Custom Photo Active' : '○ Default Initials Active'}
                  </span>
                </div>

                <div className="profile-photo-row" style={{ marginTop: 14 }}>
                  {/* Large Avatar Preview with Camera overlay button */}
                  <div className="profile-avatar-wrapper">
                    <div 
                      className="profile-avatar-display"
                      style={{ 
                        backgroundColor: currentUser?.avatarUrl ? 'transparent' : profileAvatarColor 
                      }}
                    >
                      {currentUser?.avatarUrl ? (
                        <img 
                          src={currentUser.avatarUrl} 
                          alt={profileName || currentUser?.name} 
                          className="profile-avatar-large-img"
                        />
                      ) : (
                        <span className="profile-avatar-initials">
                          {profileName ? profileName.substring(0, 2).toUpperCase() : 'OP'}
                        </span>
                      )}
                    </div>
                    <button 
                      type="button" 
                      className="avatar-camera-btn"
                      onClick={triggerFilePicker}
                      title="Upload or Change Photo"
                    >
                      <Icons.Camera />
                    </button>
                  </div>

                  {/* Actions & Buttons */}
                  <div className="profile-photo-actions-wrap">
                    <div className="profile-photo-buttons">
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={triggerFilePicker}
                        id="btn-upload-photo"
                      >
                        <Icons.Upload />
                        {currentUser?.avatarUrl ? "Change Photo" : "Upload Photo"}
                      </button>

                      {currentUser?.avatarUrl && (
                        <>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            onClick={handleAdjustExisting}
                            id="btn-adjust-photo"
                          >
                            <Icons.Crop />
                            Adjust Framing
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleRemovePhoto}
                            id="btn-remove-photo"
                          >
                            <Icons.Trash />
                            Remove Photo
                          </button>
                        </>
                      )}
                    </div>

                    {/* Hidden system file picker input */}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    <div className="profile-photo-meta">
                      <span>JPG, JPEG, PNG, or WEBP</span>
                      <span>•</span>
                      <span>Max 5 MB</span>
                      <span>•</span>
                      <span>Saved separately for {currentUser?.role === 'admin' ? 'Admin' : 'User'}</span>
                    </div>
                  </div>
                </div>

                {/* Initials Accent Color (Used when custom photo is removed or as fallback) */}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--border-subtle)' }}>
                  <label className="form-label" style={{ fontSize: 11.5, marginBottom: 6 }}>
                    Initials Background Accent <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Used when custom photo is not uploaded)</span>
                  </label>
                  <div className="avatar-swatch-list">
                    {avatarColorOptions.map(color => (
                      <div
                        key={color}
                        className={`avatar-swatch ${profileAvatarColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setProfileAvatarColor(color)}
                        title={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>Change Password</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Leave blank if you do not wish to modify your existing credentials.</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPwdFields(!showPwdFields)}
                  >
                    {showPwdFields ? 'Hide Password Fields' : 'Change Password'}
                  </button>
                </div>

                {showPwdFields && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="Current password"
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="Minimum 6 characters"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="Re-enter new password"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 4. ADMIN BRAND SETTINGS TAB (ADMIN ONLY) */}
      {tabSafe === 'brand' && isAdmin && (
        <form onSubmit={handleSaveBrand}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Enterprise Organization & Brand Settings</div>
                <div className="card-subtitle">Administrators can customize the platform name dynamically across login, sidebar, headers, and reports.</div>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group" style={{ maxWidth: 540 }}>
                <label className="form-label">Current Application Name</label>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  {appName}
                </div>
              </div>

              <div className="form-group" style={{ maxWidth: 540 }}>
                <label className="form-label">New Application / Organization Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  placeholder="e.g. BatchOps, Stawhats, Nexus Enterprise"
                  required
                />
              </div>

              {/* Quick Preset Chips */}
              <div style={{ marginTop: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)' }}>Quick Presets: </span>
                <div style={{ display: 'inline-flex', gap: 6, marginLeft: 8, flexWrap: 'wrap' }}>
                  {['Stawhats', 'BatchOps', 'Nexus Batch', 'Apollo Enterprise'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 11 }}
                      onClick={() => setBrandInput(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Branding Preview */}
              <div className="brand-live-preview">
                <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>Live Branding Preview:</strong>
                <div className="preview-badge-row">
                  <div style={{ background: '#0b3334', padding: '6px 12px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
                    <StawhatsLogo size={20} isLight={true} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{brandInput || appName}</span>
                    <span style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase' }}>Enterprise</span>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Browser tab title: <code>{brandInput || appName} — Dashboard</code>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Saving this setting updates the Login page, Sidebar logo, Topbar, Browser title, and all system navigation immediately.
                </div>
              </div>
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResetBrand}
              >
                Reset to "Stawhats"
              </button>
              <button type="submit" className="btn btn-primary">
                Save Application Name
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 5. ADMIN USER MANAGEMENT TAB (ADMIN ONLY) */}
      {tabSafe === 'users' && isAdmin && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="search-box" style={{ width: 280 }}>
                  <span className="search-icon"><Icons.Search /></span>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search operators by name or email..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="form-select" 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ width: 140 }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="user">Users (Operators)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4 }}>
                  {filteredUsers.length} of {users.length} users
                </span>
                <button className="btn btn-primary" onClick={() => setAddUserModalOpen(true)}>
                  + Add User
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User & Credentials</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div 
                            className="user-avatar" 
                            style={{ 
                              backgroundColor: u.avatarUrl ? 'transparent' : (u.avatarColor || '#0b3334'), 
                              width: 28, 
                              height: 28, 
                              fontSize: 11,
                              overflow: 'hidden'
                            }}
                          >
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.name} className="user-avatar-img" />
                            ) : (
                              u.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <strong>{u.name}</strong>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-tag ${u.role}`}>{u.role}</span>
                      </td>
                      <td>{u.department}</td>
                      <td>
                        <span className={`status-pill ${u.status === 'Active' ? 'success' : 'queued'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 11.5 }}>{u.lastLogin}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => setEditUserModal(u)}
                            title="Edit User"
                          >
                            <Icons.Edit /> Edit
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => toggleUserRole(u.id)}
                            title={`Switch to ${u.role === 'admin' ? 'User' : 'Admin'}`}
                          >
                            Role
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleUserStatus(u.id)}
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => openResetPasswordModal(u)}
                            title="Reset Password"
                          >
                            <Icons.Key /> Reset
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(u)}
                            title="Delete User"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add User Modal */}
          {addUserModalOpen && (
            <div className="modal-overlay" onClick={() => setAddUserModalOpen(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>Add New Enterprise User</strong>
                  <button className="action-btn-mini" onClick={() => setAddUserModalOpen(false)}><Icons.Cross /></button>
                </div>
                <form onSubmit={handleCreateUser}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" value={newUserName} onChange={e => setNewUserName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select className="form-select" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                        <option value="user">Standard User (Operator)</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input type="text" className="form-input" value={newUserDept} onChange={e => setNewUserDept(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Avatar Color</label>
                      <div className="avatar-swatch-list" style={{ marginTop: 6 }}>
                        {avatarColorOptions.map(color => (
                          <div
                            key={color}
                            className={`avatar-swatch ${newUserAvatarColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewUserAvatarColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setAddUserModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Create User</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {editUserModal && (
            <div className="modal-overlay" onClick={() => setEditUserModal(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>Edit Enterprise User: {editUserModal.name}</strong>
                  <button className="action-btn-mini" onClick={() => setEditUserModal(null)}><Icons.Cross /></button>
                </div>
                <form onSubmit={handleSaveEditedUser}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editUserModal.name} 
                        onChange={e => setEditUserModal({ ...editUserModal, name: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={editUserModal.email} 
                        onChange={e => setEditUserModal({ ...editUserModal, email: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select 
                        className="form-select" 
                        value={editUserModal.role} 
                        onChange={e => setEditUserModal({ ...editUserModal, role: e.target.value })}
                      >
                        <option value="user">Standard User (Operator)</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editUserModal.department} 
                        onChange={e => setEditUserModal({ ...editUserModal, department: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditUserModal(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reset Password Modal */}
          {resetPwdModal && (
            <div className="modal-overlay" onClick={() => setResetPwdModal(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>Password Reset: {resetPwdModal.name}</strong>
                  <button className="action-btn-mini" onClick={() => setResetPwdModal(null)}><Icons.Cross /></button>
                </div>
                <div className="modal-body">
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                    A secure temporary password has been generated for <strong>{resetPwdModal.email}</strong>. The operator will be prompted to change this credential upon next login.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Temporary Password</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={tempPassword} 
                        readOnly 
                        style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={copyTempPassword}
                      >
                        {copiedPwd ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setResetPwdModal(null)}>Done</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Crop & Adjustment Modal */}
      <ProfilePhotoCropModal 
        isOpen={cropModal.open}
        onClose={() => setCropModal(prev => ({ ...prev, open: false }))}
        imageSrc={cropModal.imageSrc}
        fileName={cropModal.fileName}
        fileSize={cropModal.fileSize}
        onSave={handleSaveCroppedPhoto}
        onChangeFile={triggerFilePicker}
      />
    </div>
  );
}

// Route wrapper for /settings/:tab
function SettingsTabRouteWrapper(props) {
  const { tab } = useParams();
  const validTabs = ['appearance', 'preferences', 'profile', 'brand', 'users'];
  const activeTab = validTabs.includes(tab) ? tab : 'appearance';
  return <SettingsView {...props} activeTab={activeTab} />;
}

// =========================================================================
// ADMIN: JOB MANAGEMENT VIEW
// =========================================================================
function AdminJobManagementView({ jobs, onOpenJob, onDeleteJob, onNewJob }) {
  return (
    <div>
      <BackButton fallback="/dashboard" label="Back to Dashboard" />
      <div className="page-header">
        <div className="page-title-group">
          <h2>
            <Icons.Jobs />
            Batch Job Management (Admin)
          </h2>
          <p>Create, configure schedules, and delete batch job definitions.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={onNewJob}>
            + Create New Job
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Identifier</th>
                <th>Cron Schedule</th>
                <th>SLA Limit</th>
                <th>Owner Team</th>
                <th>Priority</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.name}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{job.id} • {job.domain}</div>
                  </td>
                  <td><code>{job.schedule.split(' ')[0]} {job.schedule.split(' ')[1]} {job.schedule.split(' ')[2]}</code></td>
                  <td>{job.slaLimit}</td>
                  <td>{job.owner}</td>
                  <td>{job.priority}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onOpenJob(job)}>
                        Inspect
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDeleteJob(job.id)}>
                        Delete
                      </button>
                    </div>
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

// =========================================================================
// SCHEDULE NEW JOB MODAL
// =========================================================================
function ScheduleJobModal({ onClose, onAddJob }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("Financial Settlement");
  const [schedule, setSchedule] = useState("0 3 * * *");
  const [priority, setPriority] = useState("High");
  const [slaLimit, setSlaLimit] = useState("30m 00s");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newJob = {
      id: `BJ-${Math.floor(1105 + Math.random() * 800)}`,
      name: name.trim(),
      domain: domain,
      schedule: `${schedule} (Scheduled)`,
      status: "queued",
      duration: "--",
      slaLimit: slaLimit,
      dependenciesCount: { up: 1, down: 1 },
      lastRun: "Never",
      nextRun: "Scheduled",
      owner: "Operations Team",
      records: "0 rows (Pending)",
      cluster: "prod-us-east-1",
      worker: "worker-node-pool",
      priority: priority,
      slaTier: domain === "Financial Settlement" ? "Tier 1 Financial" : "Tier 2 Analytics",
      failureReason: null
    };

    onAddJob(newJob);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong style={{ fontSize: 13, color: '#0f172a' }}>Schedule New Batch Job</strong>
          <button className="action-btn-mini" onClick={onClose}><Icons.Cross /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Job Display Name</label>
              <input type="text" className="form-input" placeholder="e.g. Daily Balance Ingestion..." value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Domain Pipeline</label>
              <select className="form-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="Financial Settlement">Financial Settlement</option>
                <option value="Risk & Compliance">Risk & Compliance</option>
                <option value="Customer 360">Customer 360</option>
                <option value="Data Platform">Data Platform</option>
                <option value="Supply Chain">Supply Chain</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cron Schedule</label>
              <input type="text" className="form-input" value={schedule} onChange={e => setSchedule(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">SLA Duration Limit</label>
              <input type="text" className="form-input" value={slaLimit} onChange={e => setSlaLimit(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule Job</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Wrapper to ensure App works whether mounted inside BrowserRouter or standalone
function App() {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <AppContent />;
  }
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
