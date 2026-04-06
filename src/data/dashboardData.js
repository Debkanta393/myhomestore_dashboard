export const ordersData = {
  "1M": [
    { label: "Week 1", orders: 48,  returns: 4  },
    { label: "Week 2", orders: 63,  returns: 5  },
    { label: "Week 3", orders: 55,  returns: 3  },
    { label: "Week 4", orders: 74,  returns: 6  },
  ],
  "3M": [
    { label: "Jan", orders: 182, returns: 14 },
    { label: "Feb", orders: 214, returns: 17 },
    { label: "Mar", orders: 197, returns: 12 },
  ],
  "6M": [
    { label: "Jan", orders: 182, returns: 14 },
    { label: "Feb", orders: 214, returns: 17 },
    { label: "Mar", orders: 197, returns: 12 },
    { label: "Apr", orders: 231, returns: 19 },
    { label: "May", orders: 261, returns: 21 },
    { label: "Jun", orders: 248, returns: 18 },
  ],
  "1Y": [
    { label: "Jan", orders: 182, returns: 14 },
    { label: "Feb", orders: 214, returns: 17 },
    { label: "Mar", orders: 197, returns: 12 },
    { label: "Apr", orders: 231, returns: 19 },
    { label: "May", orders: 261, returns: 21 },
    { label: "Jun", orders: 248, returns: 18 },
    { label: "Jul", orders: 274, returns: 22 },
    { label: "Aug", orders: 293, returns: 24 },
    { label: "Sep", orders: 266, returns: 20 },
    { label: "Oct", orders: 318, returns: 27 },
    { label: "Nov", orders: 302, returns: 25 },
    { label: "Dec", orders: 345, returns: 29 },
  ],
};

export const revenueData = [
  { month: "Jan", revenue: 42000, target: 38000, cost: 24000 },
  { month: "Feb", revenue: 51000, target: 45000, cost: 29000 },
  { month: "Mar", revenue: 47000, target: 50000, cost: 27000 },
  { month: "Apr", revenue: 58000, target: 52000, cost: 33000 },
  { month: "May", revenue: 64000, target: 58000, cost: 36000 },
  { month: "Jun", revenue: 72000, target: 65000, cost: 41000 },
  { month: "Jul", revenue: 69000, target: 70000, cost: 39000 },
  { month: "Aug", revenue: 81000, target: 72000, cost: 46000 },
  { month: "Sep", revenue: 75000, target: 75000, cost: 43000 },
  { month: "Oct", revenue: 89000, target: 80000, cost: 50000 },
  { month: "Nov", revenue: 84000, target: 85000, cost: 48000 },
  { month: "Dec", revenue: 98000, target: 90000, cost: 55000 },
];

export const brandData = [
  { name: "Kajaria",     value: 28, color: "#4d98a4" },
  { name: "Somany",      value: 22, color: "#a46cdc" },
  { name: "Orient Bell", value: 17, color: "#e3ac30" },
  { name: "Johnson",     value: 14, color: "#68a63f" },
  { name: "RAK",         value: 11, color: "#528ec4" },
  { name: "Others",      value:  8, color: "#d96470" },
];

export const categoryData = [
  { name: "Floor Tiles", value: 38, color: "#4d98a4" },
  { name: "Wall Tiles",  value: 27, color: "#a46cdc" },
  { name: "Outdoor",     value: 18, color: "#e3ac30" },
  { name: "Mosaic",      value: 10, color: "#68a63f" },
  { name: "Designer",    value:  7, color: "#d96470" },
];

export const inventoryData = [
  { cat: "Floor Tiles", inStock: 1240, low: 82, out: 14 },
  { cat: "Wall Tiles",  inStock:  980, low: 63, out:  8 },
  { cat: "Outdoor",     inStock:  540, low: 41, out:  5 },
  { cat: "Mosaic",      inStock:  320, low: 28, out:  3 },
  { cat: "Designer",    inStock:  180, low: 22, out:  6 },
];

export const trafficData = [
  { day: "Mon", visits: 142, conversions: 18 },
  { day: "Tue", visits: 189, conversions: 24 },
  { day: "Wed", visits: 204, conversions: 31 },
  { day: "Thu", visits: 176, conversions: 22 },
  { day: "Fri", visits: 231, conversions: 38 },
  { day: "Sat", visits: 198, conversions: 29 },
  { day: "Sun", visits: 154, conversions: 19 },
];

export const recentOrders = [
  { id: "5821", customer: "Rajesh Constructions", items: 12, amount: 24500, status: "Delivered",  date: "Today"     },
  { id: "5820", customer: "Mehra Interiors",       items:  8, amount: 18200, status: "Processing", date: "Today"     },
  { id: "5819", customer: "Sunrise Builders",      items: 24, amount: 52100, status: "Shipped",    date: "Yesterday" },
  { id: "5818", customer: "A.K. Traders",          items:  6, amount:  9800, status: "Delivered",  date: "Yesterday" },
  { id: "5817", customer: "ModHome Decors",        items: 18, amount: 37600, status: "Pending",    date: "Dec 28"    },
  { id: "5816", customer: "Patel Tiles Pvt Ltd",   items: 30, amount: 68000, status: "Shipped",    date: "Dec 27"    },
];

export const topProducts = [
  { rank: 1, name: "Nexus Marble 60×60", brand: "Kajaria",    sold: 312, rev: 156000, rating: 4.8 },
  { rank: 2, name: "Azure Wave 30×60",   brand: "Somany",     sold: 289, rev: 121380, rating: 4.7 },
  { rank: 3, name: "Terra Brown Matt",   brand: "Orient Bell",sold: 254, rev:  88900, rating: 4.5 },
  { rank: 4, name: "Frost Grey Gloss",   brand: "Johnson",    sold: 231, rev:  79050, rating: 4.6 },
  { rank: 5, name: "Royal Onyx 80×80",   brand: "RAK",        sold: 198, rev: 138600, rating: 4.9 },
];

export const kpiCards = [
  { icon: "ShoppingCart", label: "Total Orders",   value: 3847,   prefix: "",  suffix: "",    delta: 12, note: "vs last month",  accent: "var(--color-primary)" },
  { icon: "IndianRupee",  label: "Total Revenue",  value: 821400, prefix: "₹",suffix: "",    delta: 8,  note: "vs last month",  accent: "var(--color-success)" },
  { icon: "Layers",       label: "Products",       value: 1284,   prefix: "",  suffix: "",    delta: 5,  note: "new this month", accent: "var(--color-blue)"    },
  { icon: "Users",        label: "Customers",      value: 642,    prefix: "",  suffix: "",    delta: 18, note: "new this month", accent: "var(--color-purple)"  },
  { icon: "Clock",        label: "Pending Orders", value: 47,     prefix: "",  suffix: "",    delta: -9, note: "vs last week",   accent: "var(--color-warning)" },
  { icon: "Star",         label: "Avg Rating",     value: 47,     prefix: "",  suffix: "/50", delta: 3,  note: "improvement",    accent: "var(--color-gold)"    },
];