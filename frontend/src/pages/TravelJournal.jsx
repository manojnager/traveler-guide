import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { getBlogPosts, getBlogCategories } from "../services/blogPostService";
import { getImageUrl } from "../utils/image";

import "./TravelJournal.css";

function TravelJournal() {
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogCategories()
      .then((data) => setCategories(["All", ...data]))
      .catch(() => setCategories(["All"]));
  }, []);

  useEffect(() => {
    setLoading(true);

    getBlogPosts({ page, limit: 9, category: activeCategory })
      .then((data) => {
        setPosts(data.items);
        setTotalPages(data.totalPages);
      })
      .catch(() => toast.error("Failed to load journal posts."))
      .finally(() => setLoading(false));
  }, [page, activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

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
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`journal-filter-chip ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="journal-loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="journal-skeleton" key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="journal-empty">
              <p>No articles found in this category yet.</p>
            </div>
          ) : (
            <>
              <div className="journal-grid">
                {posts.map((article) => (
                  <Link to={`/travel-journal/${article.slug}`} className="journal-card" key={article.id}>
                    <div className="journal-card-image">
                      <img
                        src={getImageUrl(article.coverImage)}
                        alt={article.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400/121c2b/C8A96A?text=Traveler+Guide";
                        }}
                      />
                      <span className="journal-card-category">{article.category}</span>
                    </div>

                    <div className="journal-card-body">
                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>

                      <div className="journal-card-meta">
                        <span><FaCalendarAlt /> {format(new Date(article.publishedAt), "MMM dd, yyyy")}</span>
                        <span><FaClock /> {article.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="journal-pagination">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>

                  <span>Page {page} of {totalPages}</span>

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </main>
  );
}

export default TravelJournal;
