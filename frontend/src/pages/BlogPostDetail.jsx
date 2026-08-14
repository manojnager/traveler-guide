import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft } from "react-icons/fa";
import { FaFacebookF, FaXTwitter, FaWhatsapp, FaLink } from "react-icons/fa6";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { getBlogPostBySlug } from "../services/blogPostService";
import { getImageUrl } from "../utils/image";
import SEO from "../components/SEO/SEO";

import "./BlogPostDetail.css";

function BlogPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);

      try {
        const data = await getBlogPostBySlug(slug);
        setPost(data);
        window.scrollTo(0, 0);
      } catch {
        toast.error("This article could not be found.");
        navigate("/travel-journal", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard.");
  };

  if (loading) {
    return <div className="bpd-loading">Loading article...</div>;
  }

  if (!post) {
    return null;
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const coverImageUrl = getImageUrl(post.coverImage);

  return (
    <main className="bpd-page">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={coverImageUrl}
        url={shareUrl}
      />

      <section
        className="bpd-hero"
        style={{ backgroundImage: `url(${coverImageUrl})` }}
      >
        <div className="bpd-hero-overlay" />
        <div className="container bpd-hero-content">
          <span className="bpd-category">{post.category}</span>
          <h1>{post.title}</h1>

          <div className="bpd-meta">
            <span><FaUser /> {post.author?.firstName} {post.author?.lastName}</span>
            <span><FaCalendarAlt /> {format(new Date(post.publishedAt), "MMM dd, yyyy")}</span>
            <span><FaClock /> {post.readTime}</span>
          </div>
        </div>
      </section>

      <section className="section bpd-content-section">
        <div className="container bpd-content-container">
          <Link to="/travel-journal" className="bpd-back-link">
            <FaArrowLeft /> Back to Travel Journal
          </Link>

          <div className="bpd-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="bpd-share">
            <span>Share this article</span>
            <div className="bpd-share-buttons">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bpd-share-btn"
                aria-label="Share on Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bpd-share-btn"
                aria-label="Share on X"
              >
                <FaXTwitter />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bpd-share-btn"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <button type="button" className="bpd-share-btn" onClick={handleCopyLink} aria-label="Copy link">
                <FaLink />
              </button>
            </div>
          </div>

          {post.relatedPosts?.length > 0 && (
            <div className="bpd-related">
              <h3>More in {post.category}</h3>

              <div className="bpd-related-grid">
                {post.relatedPosts.map((related) => (
                  <Link to={`/travel-journal/${related.slug}`} className="bpd-related-card" key={related.id}>
                    <img
                      src={getImageUrl(related.coverImage)}
                      alt={related.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x300/121c2b/C8A96A?text=Traveler+Guide";
                      }}
                    />
                    <div className="bpd-related-body">
                      <span>{related.readTime}</span>
                      <h4>{related.title}</h4>
                      <div className="bpd-related-shortcontent">{related.excerpt}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default BlogPostDetail;