import { useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

import "./TravelJournal.css";

const ARTICLES = [
  {
    category: "Guides",
    title: "The Ultimate Guide to Traveling Santorini Off-Season",
    excerpt: "Skip the crowds and discover why late autumn might be the best-kept secret for experiencing the Greek islands.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=80",
    date: "June 12, 2026",
    readTime: "6 min read"
  },
  {
    category: "Inspiration",
    title: "10 Destinations That Redefine Luxury Travel in 2026",
    excerpt: "From private overwater villas to heli-accessible mountain lodges — here's where the world's most discerning travelers are heading next.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&q=80",
    date: "May 28, 2026",
    readTime: "8 min read"
  },
  {
    category: "Tips",
    title: "Packing Like a Pro: A Minimalist's Guide to Luxury Travel",
    excerpt: "Travel lighter without sacrificing style. Our travel designers share their go-to packing strategies for every climate.",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&q=80",
    date: "May 15, 2026",
    readTime: "5 min read"
  },
  {
    category: "Culture",
    title: "A Culinary Journey Through Kyoto's Hidden Kitchens",
    excerpt: "Beyond the temples and gardens lies a food culture centuries in the making. Here's where to eat like a local.",
    image: "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=900&q=80",
    date: "April 30, 2026",
    readTime: "7 min read"
  },
  {
    category: "Guides",
    title: "First-Time Safari: What to Expect and How to Prepare",
    excerpt: "Everything from what to pack to the best time of year to spot the Big Five on your first African safari.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80",
    date: "April 18, 2026",
    readTime: "9 min read"
  },
  {
    category: "Inspiration",
    title: "Why Slow Travel Is the Trend Worth Following",
    excerpt: "Fewer destinations, deeper experiences. We explore why more travelers are choosing quality over quantity.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80",
    date: "April 3, 2026",
    readTime: "4 min read"
  }
];

const CATEGORIES = ["All", "Guides", "Inspiration", "Tips", "Culture"];

function TravelJournal() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <main className="journal-page">
      <section
        className="journal-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80)" }}
      >
        <div className="journal-hero-overlay" />
        <div className="container">
          <span>Travel Journal</span>
          <h1>Stories, Guides & Inspiration</h1>
          <p>Field notes from our travel designers — for the trip you're planning and the one you haven't dreamed up yet.</p>
        </div>
      </section>

      <section className="section journal-content">
        <div className="container">
          <div className="journal-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`journal-filter-chip ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="journal-grid">
            {filteredArticles.map((article) => (
              <article className="journal-card" key={article.title}>
                <div className="journal-card-image">
                  <img src={article.image} alt={article.title} />
                  <span className="journal-card-category">{article.category}</span>
                </div>

                <div className="journal-card-body">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>

                  <div className="journal-card-meta">
                    <span><FaCalendarAlt /> {article.date}</span>
                    <span><FaClock /> {article.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default TravelJournal;