import multitasking from "../assets/icons/multitasking.svg";
import contract  from "../assets/icons/contract.svg";
import growth from "../assets/icons/growth.svg";
import help from "../assets/icons/help.svg";
import system from "../assets/icons/system.svg";
import wallet from "../assets/icons/wallet.svg";

export const navItems = [
    {title: "Home", path: "#home"},
    {title: "About", path: "#about"},
    {title: "Solutions", path: "#solutions"},
    {title: "You", path: "#users"},
    {title: "FAQs", path: "#faqs"},  
];

export const UsersItems = [
    {
        icon:multitasking,
        title: "Earn",
        description: " Earn crypto ($ZIV) by completing social tasks, engaging with the community, or contributing value."
    },
     {
        icon:growth,
        title: "Stake",
        description: "Stake your earnings to grow them (no technical know-how needed)."
    },
     {
        icon:system,
        title: "Defi",
        description: "Discover a DeFi system backed by engagement (SEB-DeFi), not just capital."
    },
     {
        icon:contract,
        title: "Smart-Contract",
        description: "Join or create campaigns, crowdfunds, or job listings with real-time smart contracts."
    },
     {
        icon:help,
        title: "Help",
        description: "Stay compliant and accessible with Sharia-compliant finance for underserved communities."
    },
     {
        icon:wallet,
        title: "Wallet",
        description: " Access a multi-chain wallet with fast, low-fee transactions across major blockchains."
    }
];

export const SoluItems = [
    {
        title: "Unemployment and Underemployment in Web3",
        description:
        `While Web3 is booming, many skilled individuals are jobless or underpaid. Ziver integrates a job marketplace that:
        - Connects talent with blockchain-based tasks 
        - Rewards both contributors and referrers 
        -Enables peer-to-peer value exchange using ZIV Coin`
    
    },
    {
      title: "Lack of Incentive for Active Social Engagement:",
        description:
        `Ziver flips the game. Every positive-verified engagement earns you real rewards, helping you monetize your voice and presence online.`
    },
    {
      title: "High Barriers to Entry for New Users:",
        description:
        `Navigating DeFi and blockchain is complex and intimidating for beginners. Ziver simplifies access by offering:
         - User-friendly onboarding.

         - Gamified earning mechanisms.

         - A Social & Engagement-Backed DeFi (SEB-DeFi) protocol.` 
         
    },
    {
       title: "Disconnection Between Communities, Projects, and Opportunities:",
        description:
        `The blockchain space is fragmented with communities, DeFi products, job marketplaces, and gamified platforms all operating in silos. 
        Ziver creates a multi-blockchain ecosystem that unifies – traders, creators, gamers, employers, freelancers, and everyday users.`
    },
    {
       title: "Lack of Sharia-Compliant DeFi Options:",
        description:
        `Millions of Muslims remain underrepresented in DeFi due to the lack of Sharia-compliant financial systems. Ziver’s Sharia-compliant SEB-DeFi model opens DeFi access to this vast, previously untapped market.`
    }
];

export const faqItems = [
    {
        question:"What blockchain does Ziver use?",
    answer:" Ziver is built on TON and supports cross-chain functionality across multiple major chains."
    },
    {
        question:"Do I need to invest money to earn rewards?",
        answer:"No. You earn by engaging, liking, sharing, creating, contributing. Your voice has value here."
    },
    {
        question:" Is Ziver beginner-friendly?",
        answer: " Yes! You don’t need to be a crypto expert to use Ziver. We’ve simplified everything."
    },
    {
        question: " Is it Sharia-compliant?",
        answer: "Yes. Ziver includes a unique Sharia-compliant SEB-DeFi protocol to ensure inclusion and trust."
    }
];
    

export const footerItems = [
    {
        Socials: [
           { title: "instagram", icon:"/assets/icons/instagram.svg", path: "#"},
           { title: "X", icon:"/assets/icons/twitter-alt.svg", path: "#"},
           { title: "telegram", icon:"/assets/icons/telegram.svg", path: "#"},
        ],
    },
    {
        links: [
           { title: "Privacy", path: "#"},
           { title: "Disclaimer", path: "#"},
           { title: "support", path: "#"},
        ],
    },
];