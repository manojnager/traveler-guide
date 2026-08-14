import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { format } from "date-fns";

import { getLatestBlogPosts } from "../../services/blogPostService";
import { getImageUrl } from "../../utils/image";

import "./LatestJournal.css";

export default function LatestJournal() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestBlogPosts(3)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="latest-journal">
      <div className="container">
        <div className="section-heading">
          <span>From the Journal</span>
          <h2>Stories & Inspiration</h2>
          <p>Field notes from our travel designers to help plan your next journey.</p>
        </div>

        <div className="latest-journal-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="latest-journal-skeleton" />)
            : posts.map((post) => (
                <Link to={`/travel-journal/${post.slug}`} className="latest-journal-card" key={post.id}>
                  <div className="latest-journal-image">
                    <img
                      src={getImageUrl(post.coverImage)}
                      alt={post.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/500x350/121c2b/C8A96A?text=Traveler+Guide";
                      }}
                    />
                    <span>{post.category}</span>
                  </div>

                  <div className="latest-journal-body">
                    <h3>{post.title}</h3>
                    <div className="latest-journal-meta">
                      <FaCalendarAlt /> {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div className="latest-journal-footer">
          <Link to="/travel-journal" className="latest-journal-link">
            View All Articles <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}