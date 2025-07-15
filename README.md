# Ziver: The Open Hack MVP

![Ziver Logo](https://olive-deliberate-piranha-369.mypinata.cloud/ipfs/QmdKf7XTWwcuV1t7g51haWDiCiMXNFoDGMUjX8BSLGLGto ) **Ziver is a pioneering multi-blockchain platform built on TON, designed to transform user engagement into tangible value through a gamified Telegram Mini App (TMA).**

Our MVP for **The Open Hack** focuses on creating a sustainable, monetized engagement loop within the TON ecosystem, introducing a unique "Social Capital" concept that rewards users for their activity and reputation.

---

## 🚀 Hackathon MVP Features

Our submission showcases a fully functional backend API, a secure TON smart contract, and a clear, user-centric vision.

* **✨ Gamified ZP Mining:** Users can effortlessly start mining Ziver Points (ZP) in 4-hour cycles, claim their rewards, and use ZP to upgrade their mining capabilities (speed, capacity, duration).
* **✅ Interactive Task System:** A dynamic list of tasks that users can complete to earn bonus ZP. This includes in-app actions ("Maintain a 3-day streak") and external tasks ("Follow a partner on Twitter"), all designed to boost ecosystem growth.
* **💼 Micro-Job Marketplace with On-Chain Escrow:**
    * **Post & Complete Jobs:** TON projects and users can post small, verifiable tasks, paying directly in TON.
    * **Secure Escrow:** All job funds are held in a secure FunC smart contract on the TON blockchain.
    * **Automated Expiry:** The contract includes an auto-expiry feature to refund posters if a task is not completed in time.
    * **Dispute Resolution:** A moderator role is built-in to handle and resolve disputes fairly.
* **🏆 Social Engagement Badge:** We introduce a simplified version of our "Social Capital Score." A user's score visibly increases with every task completion, mining claim, and daily check-in, demonstrating our core vision of turning participation into measurable, on-chain reputation.
* **🔐 Secure User Authentication:** The system includes robust user registration and login, complete with **Two-Factor Authentication (2FA)** for enhanced security.

---

## 🛠️ Tech Stack

* **Frontend:** Telegram Mini App (TMA) built with React.js/Vue.js
* **Backend:** Python with **FastAPI** for a high-performance, asynchronous API.
* **Blockchain:**
    * **TON** for high-speed, low-cost transactions.
    * **FunC** for the secure Escrow Smart Contract.
* **Database:** PostgreSQL with SQLAlchemy for robust data management.
* **Key TON Integrations:**
    * **TON Connect:** For seamless and secure wallet connection.
    * **Telegram Stars:** Planned for in-app purchases and upgrades.
    * **SBTs (Soul-Bound Tokens):** Planned for issuing non-transferable achievement badges.

---

## ⚙️ Running the Project

### Prerequisites

* Python 3.10+
* PostgreSQL
* Node.js and npm (for deploying the smart contract)
* A `.env` file configured based on `.env.example`

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/ziver-mvp.git](https://github.com/your-username/ziver-mvp.git)
    cd ziver-mvp
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Set up your `.env` file:**
    ```
    DATABASE_URL=postgresql://user:password@host:port/database_name
    SECRET_KEY=your_strong_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=60
    # ... and other settings from config.py
    ```
4.  **Run the application:**
    ```bash
    uvicorn app.main:app --reload
    ```
5.  Access the interactive API documentation at `http://127.0.0.1:8000/api/v1/docs`.

### Smart Contract

Instructions for deploying and testing the FunC smart contract using Blueprint.

*npx blueprint build - - to build and compile the contract*

*npx blueprint test - - to test the smart contract in a simulation environment*

*npx blueprint run - - to deploy the smart contract to testnet or mainnet*
---

## 👥 Team

* **Zaidu Abubakar:** Project Lead, Strategist
* **Leonid Cheremshantsev:** Smart Contracts & Backend Developer
* **Adebanjo Dara:** TMA UI/UX Design Lead


