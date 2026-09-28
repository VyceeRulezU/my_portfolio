---
title: William & Helen Heritage Foundation
slug: whhf
num: '01'
type: live
role: Product Designer & UX Engineer
year: '2026'
url: 'https://whheritagefoundation.org'
headline: A digital home for a legacy of giving.
desc: >-
  Public website and donation portal for an Abuja-based NGO supporting indigent
  cancer patients, with an admin workspace for donations, supporter email and
  newsletters.
cover: portfolio/whhf/whhf-mock.png
gallery: []
---
## Overview

The William & Helen Heritage Foundation (WHHF) is an Abuja-based NGO established in memory of Rev. (Mrs) Helen Titilayo Okoye, under the umbrella of the All Christians Fellowship Mission. Its founding cause is supporting indigent cancer patients.

I designed and built the foundation's platform end to end: the public website, a donation portal for supporters in Nigeria and abroad, and an admin dashboard the team uses to run day-to-day operations.

## Problem

WHHF needed a credible public presence that could tell the founder's story, show where donations go, and make giving simple for supporters at home and in the diaspora.

Behind the scenes, a small team needed one place to track donations, answer supporters and send updates, without adding admin work.

Because the platform handles real donor funds, every payment and data-handling decision had to be production-grade from day one, not a prototype.

## Solution

A dignified, editorial visual language of deep black, warm gold and serif headlines honours the founder's legacy, while "Donate Now" stays one click away on every page.

- Public site: founding story, programmes, impact reporting, leadership, blog, gallery and contact, with a newsletter signup in the footer.
- Donation portal: gifts in naira and international currencies (USD, GBP), built on a single provider-agnostic payment layer so Paystack, Flutterwave and Korapay plug in without changing the donor flow.
- Admin dashboard: a CRM-style workspace with donation tracking and export, a unified inbox for email and contact-form messages (reply, forward, compose), and a newsletter composer that sends personalised, unsubscribe-able emails.

Built with Next.js 15, React 19 and strict TypeScript on Cloudflare Workers, with PostgreSQL via Drizzle, Cloudflare R2 for media and Resend for branded receipts and newsletters. Styling uses CSS Modules driven by a JSON design-token system.

## Impact

The platform is live at whheritagefoundation.org, giving the foundation a trustworthy home for its story and a direct giving channel for donors at home and abroad.

Donations, supporter messages and newsletters are now managed from a single dashboard.

The token-driven design system and pluggable payment layer mean new programmes, pages and payment methods can be added without reworking the core.
