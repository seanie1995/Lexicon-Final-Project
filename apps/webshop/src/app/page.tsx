import ProductCard from "@/components/product-card";
import type { Product } from "@/app/types/types";

const mockProduct: Product = {
  id: 1,
  title: "Leaves of Grass",
  description:
    "A first edition of Walt Whitman's landmark poetry collection, featuring his revolutionary free verse celebrating nature, humanity, and the American spirit.",
  price: 4250,
  discountPercentage: 0,
  weight: 1.2,
  warrantyInformation: "Certificate of authenticity included",
  shippingInformation: "Insured shipping, 5-7 business days",
  availabilityStatus: "In Stock",
  category: { id: 1, name: "Poetry" },
  images: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB8mRudzwP8VJTa54At4LifVArmm9J3Ba845BC4YJci9Qw8---fEp06oSJ0ouN0HybnvCE0t-kOjsXp3S6crVAGijizxfKxmw6Q8s8v8v2A4nVK0rMeqT2BZqOjpS1-0AmJwI8c-m1ud7L9ROQaxueZCckSW-LKCCEU8wa7oaOf_sCpvJdJ-OQoyT4YVxTCiRnYLe4j9FMA_1xwSGZLZyHLuEcd-DFOSHoUi4bqhpD2XiqvpnIRmA2t9ymv5mM8liIPgZ63aukS35x_",
  ],
  thumbnail:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB8mRudzwP8VJTa54At4LifVArmm9J3Ba845BC4YJci9Qw8---fEp06oSJ0ouN0HybnvCE0t-kOjsXp3S6crVAGijizxfKxmw6Q8s8v8v2A4nVK0rMeqT2BZqOjpS1-0AmJwI8c-m1ud7L9ROQaxueZCckSW-LKCCEU8wa7oaOf_sCpvJdJ-OQoyT4YVxTCiRnYLe4j9FMA_1xwSGZLZyHLuEcd-DFOSHoUi4bqhpD2XiqvpnIRmA2t9ymv5mM8liIPgZ63aukS35x_",
  tags: ["poetry", "first edition", "american literature"],
  condition: {
    id: 1,
    exterior: "Minor wear on edges",
    interior: "Clean pages",
    grade: "Fine",
  },
  era: "19th Century",
  genre: "Poetry",
  author: {
    id: 1,
    name: "Walt Whitman",
    description: "American poet and journalist",
  },
  format: "Hardcover",
  publisher: {
    id: 1,
    name: "James R. Osgood & Co.",
    description: "Boston publisher",
  },
  year: new Date("1855-01-01"),
  binding: "Leather",
};

export default function Home() {
  return (
    <main className="max-w-sm mx-auto p-8">
      <ProductCard product={mockProduct} />
    </main>
  );
}
