import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft } from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { getBlogPostBySlug } from "../services/blogPostService";
import { getImageUrl } from "../utils/image";

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
      } catch {
        toast.error("This article could not be found.");
        navigate("/travel-journal", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, navigate]);

  if (loading) {
    return <div className="bpd-loading">Loading article...</div>;
  }

  if (!post) {
    return null;
  }

  return (
    <main className="bpd-page">
      <section
        className="bpd-hero"
        style={{ backgroundImage: `url(${getImageUrl(post.coverImage)})` }}
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
        </div>
      </section>
    </main>
  );
}

export default BlogPostDetail;