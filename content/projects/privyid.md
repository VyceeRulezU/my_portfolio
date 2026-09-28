---
title: PrivyID
slug: privyid
num: '04'
type: live
role: Product Designer & UX Engineer
year: '2025'
url: 'https://app-privyid.vercel.app/'
headline: Security-first digital identity for the modern enterprise.
desc: >-
  PrivyID is a privacy-first KYC/KYB infrastructure platform that lets
  businesses verify customer and merchant identities without compromising on
  data security.
cover: portfolio/privyid/cover.png
gallery:
  - portfolio/privyid/gallery/78.png
  - portfolio/privyid/gallery/79.png
  - portfolio/privyid/gallery/80.png
  - portfolio/privyid/gallery/81.png
  - portfolio/privyid/gallery/82.png
  - portfolio/privyid/gallery/83.png
  - portfolio/privyid/gallery/84.png
  - portfolio/privyid/gallery/85.png
  - portfolio/privyid/gallery/86.png
  - portfolio/privyid/gallery/87.png
  - portfolio/privyid/gallery/88.png
  - portfolio/privyid/gallery/89.png
  - portfolio/privyid/gallery/90.png
  - portfolio/privyid/gallery/91.png
  - portfolio/privyid/gallery/92.png
  - portfolio/privyid/gallery/93.png
  - portfolio/privyid/gallery/94.png
  - portfolio/privyid/gallery/95.png
  - portfolio/privyid/gallery/96.png
  - portfolio/privyid/gallery/97.png
  - portfolio/privyid/gallery/98.png
  - portfolio/privyid/gallery/99.png
  - portfolio/privyid/gallery/100.png
  - portfolio/privyid/gallery/101.png
  - portfolio/privyid/gallery/102.png
  - portfolio/privyid/gallery/103.png
  - portfolio/privyid/gallery/104.png
  - portfolio/privyid/gallery/105.png
  - portfolio/privyid/gallery/106.png
  - portfolio/privyid/gallery/107.png
  - portfolio/privyid/gallery/108.png
  - portfolio/privyid/gallery/109.png
  - portfolio/privyid/gallery/110.png
  - portfolio/privyid/gallery/111.png
  - portfolio/privyid/gallery/112.png
---
## Overview

A fintech client needed a production-ready identity verification platform to serve merchants operating in regulated environments. The brief was clear but technically complex — build a multi-tenant KYC and KYB SaaS from the ground up, API-first, with separate flows for individual identity verification, business verification, and a combined track, all managed through a centralized super admin layer.

I owned the project end-to-end as Lead Designer and UX Engineer — from architecture and information design through to component-level implementation and live deployment.

Architected the multi-tenant dashboard and the user-facing verification flow, focusing on high-trust UI/UX patterns and clear security indicators.

Built API-first for scale, with a multi-tenant dashboard for merchants and a comprehensive super admin control layer.

##### Project Snapshot

- **Client:** Confidential
- **Role:** Lead Designer & UX Engineer
- **Timeline:** 6 Months
- **Stack:** React 18, TypeScript, Vite, Recharts, CSS Modules
- **Platform:** Web (SaaS — Multi-tenant)
- **Status:** Live — 1,000+ IDs verified, 3 merchants onboarded

## Problem

Identity verification in emerging markets is a fragmented, high-friction experience on both sides of the transaction. Merchants face three core problems:

- **Integration complexity** — most KYC APIs require significant engineering effort to implement, with poor documentation and inconsistent sandbox environments
- **No unified dashboard** — merchants processing both individual (KYC) and business (KYB) verifications had no single interface to manage both workflows
- **Lack of operational visibility** — without real-time analytics and audit trails, compliance teams couldn't monitor verification status, flag anomalies, or generate reports efficiently
- **Trust and privacy tension** — users submitting identity documents need confidence their data is handled with care; most existing platforms prioritise speed over transparency

On the platform side, super admins had no structured tooling to onboard merchants, monitor API usage, manage rate limits, or handle support tickets — all critical for a multi-tenant SaaS at scale.

Identity verification processes were often intrusive, slow, and prone to data breaches due to centralized storage of sensitive PII.

## Solution

The platform was designed around three distinct user groups — merchants running KYC, merchants running KYB, and super admins managing the entire ecosystem, each with fundamentally different mental models and task flows.

**Key design decisions:**

- **Feature-based architecture** — the codebase and UI were structured around four self-contained modules (Onboarding, KYC, KYB, Combined) with shared components extracted into a unified library, preventing duplication and enabling consistent UX across all flows
- **Multi-tenant routing** — designed separate route namespaces (`/merchant-kyc`, `/merchant-kyb`, `/merchant-combined`, `/super-admin`) so each user type lands in a purpose-built environment, not a generic dashboard with toggled permissions
- **Progressive onboarding** — the merchant onboarding flow was broken into discrete steps (account type → service type → business verification → integration setup) to reduce drop-off and surface only what's relevant at each stage
- **Data-dense but scannable dashboards** — used Recharts to surface revenue trends, verification volumes (KYC vs KYB), and merchant growth in a way that supports quick decision-making without overwhelming the interface
- **API-first UX** — the API & Developers section was designed as a first-class feature, not an afterthought, with environment toggling (Production/Sandbox), key management, rate limit configuration, webhook management, and inline documentation
- **Audit and compliance baked in** — the super admin audit log was designed with advanced filtering, date range selection, and CSV/JSON export to support compliance workflows out of the box
- **9 super admin pages** fully implemented — Dashboard, Verifications, Merchants, Analytics, API & Developers, Audit Logs, Settings, Support, and User Profile

Implemented a tokenized identity framework where users control their data, and verification happens via secure, privacy-preserving handshakes.

## Impact

Reduced user drop-off during KYC by 40% while maintaining 100% compliance with local data privacy regulations.

- **1,000+ identities verified** on the live platform since launch
- **3 merchants successfully onboarded** and processing verifications in production
- **4 verification modules** delivered — KYC, KYB, Combined, and Onboarding
- **9 fully functional super admin pages** covering the complete platform management lifecycle
- **14 reusable shared components** built for the super admin module alone
- **Real-time analytics** across revenue, verification volume, and merchant growth live at launch
- **Full audit trail** with filtering and export, meeting baseline compliance requirements
- Delivered within a **6-month engagement** from discovery to production deployment
