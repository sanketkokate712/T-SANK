export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    tag?: string;
    description: string;
    sizes: string[];
    category: "autobots" | "decepticons" | "classics" | "custom";
}

export const STORE = {
    name: "T-SANK",
    tagline: "Wear the Transformation",
    owner: "Sanket Kokate",
    description:
        "Premium Transformers merchandise for fans who wear their allegiance. Every piece is crafted for comfort and designed to make a statement.",
};

export const PRODUCTS: Product[] = [
    {
        id: "optimus-prime",
        name: "Optimus Prime Heritage",
        price: 1299,
        originalPrice: 1799,
        image: "/images/products/optimus.png",
        tag: "BESTSELLER",
        description:
            "Bold Optimus Prime graphic on premium black cotton. Lead the Autobots in style.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        category: "autobots",
    },
    {
        id: "bumblebee-chibi",
        name: "Bumblebee Chibi Edition",
        price: 999,
        originalPrice: 1499,
        image: "/images/products/bumblebee.png",
        tag: "NEW",
        description:
            "Playful chibi Bumblebee on vibrant yellow cotton. Fun meets fierce.",
        sizes: ["S", "M", "L", "XL"],
        category: "autobots",
    },
    {
        id: "megatron-rise",
        name: "Megatron Dark Rise",
        price: 1399,
        image: "/images/products/megatron.png",
        tag: "LIMITED",
        description:
            "Fierce Decepticon insignia on charcoal gray. Embrace the dark side.",
        sizes: ["M", "L", "XL", "XXL"],
        category: "decepticons",
    },
    {
        id: "autobot-insignia",
        name: "Autobot Insignia Classic",
        price: 899,
        image: "/images/products/autobot-logo.png",
        description:
            "Clean red Autobot logo on crisp white cotton. Minimalist and iconic.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        category: "autobots",
    },
    {
        id: "decepticon-cyber",
        name: "Decepticon Cyber Emblem",
        price: 1499,
        originalPrice: 1999,
        image: "/images/products/decepticon.png",
        tag: "PREMIUM",
        description:
            "Metallic purple Decepticon emblem on jet black. Power in every thread.",
        sizes: ["S", "M", "L", "XL"],
        category: "decepticons",
    },
    {
        id: "retro-squad",
        name: "Retro Squad '84",
        price: 1199,
        image: "/images/products/retro.png",
        tag: "FAN FAVORITE",
        description:
            "80s-style group art on navy blue. Nostalgia meets streetwear.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        category: "classics",
    },
];

export const CATEGORIES = [
    { id: "all", label: "ALL" },
    { id: "autobots", label: "AUTOBOTS" },
    { id: "decepticons", label: "DECEPTICONS" },
    { id: "classics", label: "CLASSICS" },
];

export const NAV_LINKS = [
    { href: "#shop", label: "SHOP" },
    { href: "#collection", label: "COLLECTION" },
    { href: "#about", label: "ABOUT" },
    { href: "#contact", label: "CONTACT" },
];

export const PARALLAX_FRAMES = [1, 8, 15, 22, 30, 38];
