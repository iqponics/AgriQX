export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    rating: number;
    stock: number;
    unit: string;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Organic Hydroponic Lettuce",
        price: 4.50,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1622206141540-5844544d3f56?auto=format&fit=crop&q=80&w=400",
        description: "Crispy, fresh, and pesticide-free lettuce grown in our climate-controlled hydroponic system.",
        rating: 4.9,
        stock: 50,
        unit: "Head"
    },
    {
        id: "p2",
        name: "Premium Heirloom Tomatoes",
        price: 3.20,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
        description: "Rich, juicy tomatoes with an old-fashioned flavor. Perfect for salads and sauces.",
        rating: 4.8,
        stock: 30,
        unit: "lb"
    },
    {
        id: "p3",
        name: "Baby Spinach Mix",
        price: 5.00,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400",
        description: "Tender baby spinach leaves, triple-washed and ready to use.",
        rating: 4.7,
        stock: 40,
        unit: "Bag"
    },
    {
        id: "p4",
        name: "Golden Bell Peppers",
        price: 2.50,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1566385278603-d3997455d3ca?auto=format&fit=crop&q=80&w=400",
        description: "Sweet and crunchy yellow peppers, high in Vitamin C.",
        rating: 4.9,
        stock: 25,
        unit: "Each"
    },
    {
        id: "p5",
        name: "Fresh Strawberry Box",
        price: 6.00,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400",
        description: "Sweet, red strawberries picked at the peak of ripeness.",
        rating: 4.9,
        stock: 20,
        unit: "Box"
    }
];
