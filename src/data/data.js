import iCatalogIcon from "../assets/addons/icatalog.svg";
import AdminAppIcon from "../assets/addons/adminApp.svg";
import AiMagicIcon from "../assets/addons/aiMagic.svg";
import EcomApiIcon from "../assets/addons/ecomApi.svg";
import EvoAppIcon from "../assets/addons/evoApp.svg";
import ExpressAppIcon from "../assets/addons/expressApp.svg";
import PowerBiIcon from "../assets/addons/powerbi.svg";
import planOptigoIcon from "../assets/newMyaccountImg/procatalog.png";
import rfidImg from "../assets/newMyaccountImg/rfid.jpg";
import Invoice from "../assets/Invoice.svg";
import wa from "../assets/wA logo.png";

export const plansData = {
  currentPlanId: "basic",

  plans: [
    {
      id: "basic",
      name: "Basic",
      price: "₹0 / month",
      storage: "5 GB",
      users: "1 User",
    },
    {
      id: "starter",
      name: "Starter",
      price: "₹299 / month",
      storage: "50 GB",
      users: "2 Users",
    },
    {
      id: "standard",
      name: "Standard",
      price: "₹599 / month",
      storage: "200 GB",
      users: "5 Users",
    },
    {
      id: "pro",
      name: "Professional",
      price: "₹999 / month",
      storage: "500 GB",
      users: "10 Users",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom Pricing",
      storage: "Unlimited",
      users: "Unlimited Users",
    },
  ],
};


export const cloudStorageData = {
  storages: [
    {
      type: "Data Storage",
      used: 62,
      total: 150,
    },
    {
      type: "File Storage",
      used: 28,
      total: 100,
    },
    {
      type: "AI Cloud Storage",
      used: 12,
      total: 50,
    },
  ],

  breakdown: [
    { type: "E-Invoices", used: "22 GB" },
    { type: "Design Images", used: "30 GB" },
    { type: "Reports & Data", used: "10 GB" },
  ],
};


  export const addonsData = [
    {
      id: "whatsapp",
      name: "WhatsApp Integration",
      description: "Connect with customers on WhatsApp to send offers, order updates, invoices, and reminders instantly. Increase engagement, speed up follow-ups, and boost conversions with powerful, automated WhatsApp messaging integrated into Optigo.",
      active: false,
      icon: wa,
    },
    {
      id: "iCatalogApp",
      name: "iCatalog – Tablet-Based App",
      description: "A powerful digital catalogue for modern jewellers. Showcase collections, customize designs, generate instant quotations, and sell seamlessly from your tablet—online or offline—at exhibitions, showrooms, or client visits with elegance.",
      active: false,
      icon: iCatalogIcon,
    },
    {
      id: "einvoice",
      name: "E-Invoice – Government Portal Integration",
      description: "Generate and upload e-invoices directly to the government portal from Optigo. Ensure GST compliance, real-time IRN generation, error-free reporting, faster billing, and seamless integration without manual uploads or data duplication.",
      active: false,
      icon: Invoice,
    },
    {
      id: "ai",
      name: "AI Magic",
      description: "Search jewellery instantly using images or text. Upload photos or type keywords to find matching designs faster, improve accuracy, reduce effort, and deliver a smarter, quicker customer experience powered by Optigo AI.",
      active: false,
      icon: AiMagicIcon,
    },
    {
      id: "EVOApp",
      name: "EVO – Smart In-Store Selling App",
      description: "EVO empowers showroom staff to sell confidently. Access live stock, create bills instantly, present designs beautifully, and convert every customer interaction into sales with seamless Optigo ERP integration.",
      active: false,
      icon: EvoAppIcon,
    },
    {
      id: "optigoexpress",
      name: "Optigo Express",
      description: "Carry your entire inventory in your pocket. Scan tags, create invoices, place orders, and sync data in real time with Optigo ERP. Go paperless, work faster, sell smarter, anywhere, anytime.",
      active: false,
      icon: ExpressAppIcon,
    },
    {
      id: "proCatalog",
      name: "ProCatalog – Online Catalog",
      description: "Turn your jewellery catalog into a 24/7 sales engine. ProCatalog syncs live stock, designs, and pricing from Optigo ERP, enabling online selling with zero manual effort and complete control.",
      active: false,
      icon: planOptigoIcon,
    },
    {
      id: "eCommerceApi",
      name: "E-Commerce API Integration",
      description: "Connect your website seamlessly with Optigo using E-Commerce APIs. Sync products, pricing, stock, in real time, eliminate manual work, and manage online sales efficiently from one system.",
      active: false,
      icon: EcomApiIcon,
    },
    {
      id: "rfid",
      name: "RFID Integration",
      description: "Read hundreds of jewellery items instantly with RFID readers. Perform fast stock counts, locate items accurately, reduce manual errors, and get real-time inventory updates seamlessly synced with Optigo ERP for better control.",
      active: false,
      icon: rfidImg,
    },
    {
      id: "poweraPI",
      name: "Power API",
      descriptions: "Automate data flow to your reporting and BI tools.Access accurate, real-time business reports anytime.Scale smarter with secure Reporting Tool APIs.",
      active: false,
      icon: PowerBiIcon,
    },
  ];

  export const changeHistoryData = [
    {
      date: "12 Feb 2025",
      action: "Add-on Activated",
      details: "EVO add-on activated successfully",
    },
    {
      date: "10 Feb 2025",
      action: "Add-on Requested",
      details: "Request submitted for EVO add-on",
    },
    {
      date: "01 Jan 2025",
      action: "Plan Renewed",
      details: "Gold plan renewed for 1 year",
    },
    {
      date: "15 Dec 2024",
      action: "Add-on Activated",
      details: "E-Invoice add-on activated",
    },
    {
      date: "10 Dec 2024",
      action: "Add-on Expired",
      details: "WhatsApp Integration add-on expired",
    },
    {
      date: "05 Dec 2024",
      action: "E-Invoice Limit Reached",
      details: "Monthly e-invoice generation limit has been reached",
    },
    {
      date: "18 Aug 2024",
      action: "Plan Upgraded",
      details: "Silver plan upgraded to Gold plan",
    },
  ];  

  export const userLoginData = {
    clientInfo: {
      name: "Shree Jewellers",
      currentPlan: "Gold",
      validTill: "31 Dec 2025",
      users: 12,
    },
    
    loginAccess: [
      {
        name: "Ethan Parker",
        userId: "Ethan@eg.com",
        userCode: "EMP-001",
        isActive: true,
        isRoaming: true,
        isLoggedIn: true,
      },
      {
        name: "Madison Carter",
        userId: "Madison@eg.com",
        userCode: "EMP-002",
        isActive: true,
        isRoaming: false,
        isLoggedIn: false,
      },
      {
        name: "Aiden Brooks",
        userId: "Aiden@eg.com",
        userCode: "EMP-003",
        isActive: false,
        isRoaming: false,
        isLoggedIn: false,
      },
      {
        name: "Olivia Davis",
        userId: "Olivia@eg.com",
        userCode: "EMP-004",
        isActive: true,
        isRoaming: true,
        isLoggedIn: true,
      },
      {
        name: "Lucas Johnson",
        userId: "Lucas@eg.com",
        userCode: "EMP-005",
        isActive: true,
        isRoaming: false,
        isLoggedIn: true,
      },
      {
        name: "Emma Wilson",
        userId: "Emma@eg.com",
        userCode: "EMP-006",
        isActive: true,
        isRoaming: false,
        isLoggedIn: false,
      },
      {
        name: "Mason Taylor",
        userId: "Mason@eg.com",
        userCode: "EMP-007",
        isActive: false,
        isRoaming: false,
        isLoggedIn: false,
      },     
    ],
    
  
    userLogs: [
      {
        userId: "EMP005",
        name: "Lucas Johnson",
        login: "10 Feb 2025, 10:15 AM",
        logout: "10 Feb 2025, 06:30 PM",
        event: "Sale Invoice Printed",
      },
      {
        userId: "EMP006",
        name: "Emma Wilson",
        login: "10 Feb 2025, 11:00 AM",
        logout: "10 Feb 2025, 05:45 PM",
        event: "Quote Generated",
      },
      {
        userId: "EMP003",
        name: "Aiden Brooks",
        login: "10 Feb 2025, 09:45 AM",
        logout: "10 Feb 2025, 04:20 PM",
        event: "Estimate Created",
      },
    ],
  
    ipRequests: [
      {
        ip: "192.168.1.72",
        requestDate: "12 Feb 2025",
        requestedBy: "Ethan Parker",
        approved: true,
      },
      {
        ip: "192.168.1.81",
        requestDate: "13 Feb 2025",
        requestedBy: "Madison Carter",
        approved: false,
      },
      {
        ip: "10.0.0.54",
        requestDate: "14 Feb 2025",
        requestedBy: "Olivia Davis",
        approved: true,
      },
      {
        ip: "172.16.2.19",
        requestDate: "15 Feb 2025",
        requestedBy: "Lucas Johnson",
        approved: false,
      },
    ],    
  };  
  