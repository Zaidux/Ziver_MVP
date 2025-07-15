# Ziver: Gamifying Web3 Engagement & Empowering the TON Ecosystem (Hackathon MVP)

![Ziver Logo](https://olive-deliberate-piranha-369.mypinata.cloud/ipfs/QmdKf7XTWwcuV1t7g51haWDiCiMXNFoDGMUjX8BSLGLGto) **Deliverable URL:** [https://github.com/Zaidux/Ziver_MVP](https://github.com/Zaidux/Ziver_MVP)

## Project Overview

This submission represents the Ziver Hackathon MVP (Phase 1), a robust and monetized engagement platform built as a **Telegram Mini App (TMA)** to revolutionize user interaction and value creation on The Open Network (TON) ecosystem. Our primary focus for this wave is to deliver a fully functional core engagement loop and introduce immediate monetization mechanisms, demonstrating a new paradigm for Web3 adoption through gamification and tangible rewards.

Ziver transforms passive user time into tangible value, addressing the Web3 space's challenges of complex onboarding, fragmented user engagement, and sustainable monetization. We are building a pioneering platform that rewards users for their social capital and activity, ultimately driving mass adoption on TON.

## Key Features Implemented in this Wave (Phase 1 MVP)

Our MVP delivers on the following core functionalities:

1.  **Gamified Engagement Hub:**
    * **ZP Mining:** Users can effortlessly initiate 4-hour Ziver Point (ZP) mining cycles. Upon completion, they can claim ZP rewards, with an integrated ad display before reward distribution, establishing an immediate monetization stream.
    * **Daily Streaks:** A visual indicator encourages consistent engagement, rewarding users for maintaining daily activity and fostering habit formation.
    * **Miner Upgrades:** Users can spend earned ZP (and later TON via Telegram Stars) to enhance their mining capabilities, increasing ZP per hour, capacity, and cycle duration. This introduces a direct monetization channel.
    * **Interactive Tasks:** Users earn additional ZP by completing various tasks, including in-app challenges (e.g., achieving mining streaks) and external tasks (e.g., following TON projects on social media). This drives engagement and provides value to external projects.

2.  **Dynamic TON Micro-Job Marketplace:**
    * A dedicated section allows users and TON-native projects to post small, verifiable tasks specific to the TON ecosystem (e.g., dApp testing, community moderation, content creation).
    * **Time-Based Listing Model:** Task posters pay Ziver in TON based on the desired duration their task is visible on the marketplace, generating recurring revenue.
    * **Task Completion & Verification:** Users can browse tasks, submit proof of completion, and upon successful verification, receive payment. Ziver takes a small percentage (e.g., 5-10%) of each completed task payment as a platform fee.

3.  **Social Capital Score (Simplified Social Engagement Badge):**
    * A dynamic display reflects a user's engagement and reputation within Ziver. This score is initially based on consistent mining activity, daily streaks, and active task completion, serving as a visual "Social Engagement Badge" that demonstrates a simplified version of our Social & Engagement-Backed DeFi (SEB-DeFi) concept.

4.  **Core Infrastructure & Monetization:**
    * **User Authentication:** Secure registration and login, featuring mandatory 2-Factor Authentication (2FA) support (backend structure ready for full integration).
    * **Referral System:** Incentivizes user growth with ZP rewards for successful referrals and daily streak bonuses for active referred friends.
    * **Monetization Streams:** This MVP clearly demonstrates our immediate revenue potential through Telegram Stars from user upgrades, payments from sponsored tasks, time-based listing fees on the micro-job marketplace, and platform fees on completed micro-jobs.

## Problem Solved & Value Proposition

The Web3 space struggles with complex onboarding, fragmented user engagement, and sustainable monetization for both users and projects. Ziver addresses these by:
* **Accessibility:** Leveraging the familiar Telegram environment via a Mini App for seamless, low-barrier onboarding.
* **Engagement:** Gamifying user activity through ZP mining, daily streaks, and interactive tasks.
* **Monetization:** Creating multiple revenue streams for Ziver (ad impressions, upgrade fees, listing fees, platform fees) and providing tangible value for users (ZP, TON earnings from micro-jobs).
* **Ecosystem Growth:** Connecting TON projects with an engaged user base through sponsored tasks and the micro-job marketplace, driving adoption and utility within TON.

## Architecture Overview

Ziver follows a modular, three-tier architecture:

1.  **Frontend (Telegram Mini App - TMA)**: Built with React.js/Vue.js (TBD, but common choices) and integrated with the Telegram Mini App SDK. This provides the intuitive, mobile-first user interface within Telegram, responsible for displaying the gamified hub, task lists, micro-job marketplace, and interacting with the backend API.
2.  **Backend (FastAPI)**: Developed using Python with FastAPI, this robust API handles all core business logic, user authentication, ZP management, task processing, referral tracking, and micro-job lifecycle management. It interacts with the PostgreSQL database.
    * **Structure**:
        ```
        ziver/
        ├── backend/
        │   ├── app/
        │   │   ├── api/               # Route handlers (endpoints)
        │   │   │   └── v1/
        │   │   │       └── routes.py
        │   │   ├── core/              # Configs, utilities, security
        │   │   │   ├── config.py
        │   │   │   └── security.py
        │   │   ├── db/                # DB models, sessions
        │   │   │   ├── models.py
        │   │   │   └── database.py
        │   │   ├── services/          # Business logic (mining, referrals, tasks, microjobs)
        │   │   │   ├── mining.py
        │   │   │   ├── tasks.py
        │   │   │   ├── referrals.py
        │   │   │   └── microjobs.py
        │   │   ├── schemas/           # Pydantic schemas (validation, data representation)
        │   │   │   ├── user.py
        │   │   │   ├── mining.py
        │   │   │   ├── task.py
        │   │   │   ├── microjob.py
        │   │   │   └── referral.py
        │   │   ├── main.py            # FastAPI app entrypoint
        │   │   └── __init__.py
        │   ├── .env                   # Environment variables
        │   ├── requirements.txt       # Python dependencies
        │   └── README.md              # Project documentation
        ```
3.  **Database (PostgreSQL)**: A relational database for persistent storage of user data, ZP balances, task statuses, micro-job details, and referral information.
4.  **TON Smart Contracts (Future/Planned Integration)**: For the full vision, Ziver will utilize TON smart contracts for:
    * **Ziv Coin ($ZIV)**: Our utility token, built on TON.
    * **Secure ZP rewards & Upgrades**: For verifiable on-chain transactions for higher-tier miner upgrades (via Telegram Stars/TON).
    * **Robust Task Payment Logic**: For escrow and direct peer-to-peer TON payments within the micro-job marketplace.
    * **Soulbound Tokens (SBTs)**: Issuing non-transferable achievement badges for key milestones (e.g., advanced Social Capital Score tiers).

## Usage of TON Features (Hackathon Specific)

Ziver is intrinsically designed for and leverages the TON ecosystem:

* **Telegram Mini App (TMA)**: Our primary user interface, built directly within Telegram, offers a familiar and frictionless onboarding experience for Telegram's 900M+ users, driving viral growth on TON.
* **TON Blockchain / Ziv Coin ($ZIV)**: Our core utility token, Ziver Points (ZP), directly contributes to the concept of Ziv Coin on TON. Future phases will explore direct $ZIV token integration for advanced features and a full SEB-DeFi protocol on TON.
* **TON Payments (via Telegram Stars / Direct TON)**:
    * **Miner Upgrades**: Users will be able to spend Telegram Stars (convertible to TON) for significant boosts to their ZP mining capabilities, creating a direct monetization channel for Ziver within the TON ecosystem.
    * **Micro-Job Marketplace**: Task posters pay for time-based listings and job completion in TON, with Ziver taking a platform fee, showcasing a real-world utility for TON as a payment mechanism.
* **Social Capital on TON**: While initially a backend numerical score, the Social Capital Score is envisioned to evolve into verifiable on-chain Soulbound Tokens (SBTs) on TON, providing immutable proof of user engagement and reputation within the ecosystem.

## Getting Started (Backend Setup)

Follow these steps to set up and run the Ziver backend API:

### Prerequisites

* Python 3.9+
* Poetry (recommended for dependency management) or pip
* PostgreSQL database server

### 1. Clone the Repository

```bash
git clone [https://github.com/Zaidux/Ziver_MVP.git](https://github.com/Zaidux/Ziver_MVP.git)
cd Ziver_MVP/backend
