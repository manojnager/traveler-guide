import maldives from "../assets/images/packages/maldives-package.jpg";
import switzerland from "../assets/images/packages/switzerland-package.jpg";
import bali from "../assets/images/packages/bali-package.jpg";

const packages = [
  {
    id: 1,
    title: "Maldives Escape",
    location: "Maldives",
    duration: "5 Nights",
    rating: 4.9,
    price: 2850,
    image: maldives
  },
  {
    id: 2,
    title: "Swiss Alps Retreat",
    location: "Switzerland",
    duration: "7 Nights",
    rating: 4.8,
    price: 3490,
    image: switzerland
  },
  {
    id: 3,
    title: "Bali Wellness Journey",
    location: "Indonesia",
    duration: "6 Nights",
    rating: 4.9,
    price: 2190,
    image: bali
  }
];

export default packages;