
import React from "react";

const features = [
  {
    icon: "👥",
    title: "Customer Cases",
    description: "Manage optical customer cases",
  },
  {
    icon: "📊",
    title: "Comfort Tracking",
    description: "Monitor lens adaptation progress",
  },
  {
    icon: "👁️",
    title: "Vision Explorer",
    description: "Explore progressive lens zones",
  },
  {
    icon: "📋",
    title: "Follow-up Reviews",
    description: "Review customer feedback",
  },
];

function Dashboard() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>◉ OptiAdapt</h1>
        <span style={styles.subtitle}>
          Optical Innovation Platform
        </span>
      </header>

      <main style={styles.content}>
        <div style={styles.heading}>
          <p style={styles.label}>
            OPTICIAN WORKSPACE
          </p>

          <h2 style={styles.title}>
            Welcome to your Dashboard
          </h2>

          <p style={styles.description}>
            Your intelligent workspace for better
            optical care and customer experiences.
          </p>
        </div>

        <div style={styles.grid}>
          {features.map((feature) => (
            <div
              key={feature.title}
              style={styles.card}
            >
              <div style={styles.icon}>
                {feature.icon}
              </div>

              <h3 style={styles.cardTitle}>
                {feature.title}
              </h3>

              <p style={styles.cardDescription}>
                {feature.description}
              </p>

              <span style={styles.status}>
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#081426",
    color: "#f1f7ff",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "22px 6%",
    background: "#10213a",
    borderBottom: "1px solid #254360",
  },

  logo: {
    color: "#42e5e8",
    fontSize: "24px",
    margin: 0,
  },

  subtitle: {
    color: "#a9bfd0",
    fontSize: "13px",
  },

  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "60px 24px",
  },

  heading: {
    marginBottom: "40px",
  },

  label: {
    color: "#42e5e8",
    letterSpacing: "3px",
    fontSize: "12px",
  },

  title: {
    fontSize: "clamp(28px, 5vw, 42px)",
    margin: "15px 0",
  },

  description: {
    color: "#a9bfd0",
    lineHeight: 1.7,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
    gap: "22px",
  },

  card: {
    background: "#132743",
    padding: "30px",
    borderRadius: "18px",
    border: "1px solid #28506a",
  },

  icon: {
    fontSize: "32px",
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "19px",
    marginBottom: "12px",
  },

  cardDescription: {
    color: "#a9bfd0",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  status: {
    display: "inline-block",
    marginTop: "18px",
    color: "#42e5e8",
    fontSize: "12px",
  },
};

export default Dashboard;
