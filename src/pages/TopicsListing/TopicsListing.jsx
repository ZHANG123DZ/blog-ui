import { useState, useEffect } from "react";
import TopicList from "../../components/TopicList/TopicList";
import Loading from "../../components/Loading/Loading";
import styles from "./TopicsListing.module.scss";
import topicService from "@/services/topic/topic.service";

const TopicsListing = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  //   const mockTopics = [
  //     {
  //       id: 1,
  //       name: "JavaScript",
  //       slug: "javascript",
  //       description:
  //         "Everything about JavaScript programming language, frameworks, and best practices",
  //       icon: "🚀",
  //       postCount: 45,
  //     },
  //     {
  //       id: 2,
  //       name: "React",
  //       slug: "react",
  //       description:
  //         "React.js tutorials, tips, and advanced patterns for building modern web applications",
  //       icon: "⚛️",
  //       postCount: 32,
  //     },
  //     {
  //       id: 3,
  //       name: "Node.js",
  //       slug: "nodejs",
  //       description:
  //         "Server-side JavaScript development with Node.js and its ecosystem",
  //       icon: "🟢",
  //       postCount: 28,
  //     },
  //     {
  //       id: 4,
  //       name: "CSS",
  //       slug: "css",
  //       description:
  //         "Modern CSS techniques, animations, and responsive design patterns",
  //       icon: "🎨",
  //       postCount: 23,
  //     },
  //     {
  //       id: 5,
  //       name: "TypeScript",
  //       slug: "typescript",
  //       description: "Type-safe JavaScript development with TypeScript",
  //       icon: "🔷",
  //       postCount: 19,
  //     },
  //     {
  //       id: 6,
  //       name: "Vue.js",
  //       slug: "vuejs",
  //       description:
  //         "Progressive JavaScript framework for building user interfaces",
  //       icon: "🟩",
  //       postCount: 16,
  //     },
  //   ];

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      try {
        // Simulate API delay
        const topics = await topicService.getTopics();
        setTopics(topics.data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className={styles.topicsListing}>
        <div className="container">
          <Loading size="md" text="Loading topics..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topicsListing}>
      <div className="container">
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>All Topics</h1>
          <p className={styles.description}>
            Explore all available topics and find content that interests you.
          </p>
        </header>

        {/* Topics Grid */}
        <section className={styles.content}>
          <TopicList topics={topics} loading={loading} />
        </section>
      </div>
    </div>
  );
};

export default TopicsListing;
