import { RestaurantDetailTempData } from "@/types/restaurantTemp";

export const mockRestaurantData: RestaurantDetailTempData = {
  restaurant: {
    id: "239546",
    name: "Cafe Delight",
    location: "Koregaon Park",
    cuisine: "North Indian",
    phone: "+91 98765 43210",
    email: "cafe.delight@example.com",
    toingFlag: "Not Live",
  },
  metrics: {
    activeDrives: 3,
    zvdPo: "N/A",
    adsBudget: {
      total: 50000,
      utilized: 32000,
      percentage: 64,
    },
    toingFlag: "Not Live",
  },
  ncn: {
    priorities: [
      "High AOV Customers",
      "Weekend Orders",
      "Dinner Time Slots",
      "New Customer Acquisition",
      "Repeat Order Rate",
      "Cart Abandonment Recovery",
    ],
    activePromosLink:
      "https://admin.zomans.com/epicentre/marketing-planner/outlet-details/?resId=21378780",
    suggestedPromos: {
      bogo: {
        items: ["Paneer Butter Masala", "Dal Makhani", "Chicken Tikka", "Veg Biryani"],
      },
      flashSale: {
        items: ["Garlic Naan", "Gulab Jamun", "Raita", "Papad"],
      },
      salt: {
        percentage: 20,
      },
    },
    stepperAndBaseCodes: {
      la: [
        { id: "la1", flatOff: 100, mov: 299, status: "Submitted", selected: false },
        { id: "la2", flatOff: 150, mov: 399, status: "Picked", selected: true },
      ],
      mm: [
        { id: "mm1", flatOff: 120, mov: 349, status: "Pending", selected: false },
        { id: "mm2", flatOff: 180, mov: 449, status: "Submitted", selected: true },
      ],
      um: [
        { id: "um1", flatOff: 200, mov: 599, status: "Picked", selected: false },
        { id: "um2", flatOff: 250, mov: 699, status: "Pending", selected: true },
      ],
    },
    approached: "yes",
    converted: "wip",
  },
  n2r: {
    currentCodes: {
      la: {
        aov: 285,
        currentCode: "Flat 80rs off on MOV of 249rs",
      },
      mm: {
        aov: 450,
        currentCode: "Flat 120rs off on MOV of 349rs",
      },
      um: {
        aov: 680,
        currentCode: "Flat 180rs off on MOV of 549rs",
      },
    },
    suggestedCodes: {
      la: {
        construct: "60% upto 120",
        mov: "199rs",
      },
      mm: {
        construct: "60% upto 150",
        mov: "299rs",
      },
      um: {
        construct: "60% upto 200",
        mov: "499rs",
      },
    },
    reqCoupons: {
      la: 235,
      mm: 180,
      um: 95,
    },
    approached: "yes",
    converted: "wip",
  },
  items: {
    priority: "P0",
    posFlag: "Pet Pooja",
    pg7to10: "23%",
    dishSuggestions: [
      "Gulab Jamun (2pc)",
      "Veg Momos (4pc)",
      "Paneer Roll",
      "Veg Fried Rice",
      "Masala Dosa",
      "Chole Bhature",
    ],
    approached: "yes",
    converted: "wip",
    itemsAdded: [
      { id: "1", value: "", checked: false },
      { id: "2", value: "", checked: false },
      { id: "3", value: "", checked: false },
      { id: "4", value: "", checked: false },
      { id: "5", value: "", checked: false },
    ],
  },
  comments: [
    {
      id: "1",
      author: "Rahul Sharma (KAM)",
      text: "Restaurant owner is interested in NCN drive. Follow up scheduled for next week.",
      timestamp: "2025-11-10T14:30:00Z",
    },
    {
      id: "2",
      author: "Priya Patel (KAM)",
      text: "Budget utilization is at 65%. Need to discuss additional campaigns.",
      timestamp: "2025-11-09T10:15:00Z",
    },
  ],
};
