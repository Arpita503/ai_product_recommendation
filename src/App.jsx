import { useEffect, useState } from "react";
import { getRecommendations } from "./api/aiEngine";


function App() {
  const [products, setProducts] = useState([]);
  const [preference, setPreference] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

function extractBudget(text) {
  const match = text.match(/\$?(\d+)/);
  if (!match) return null;

  const amount = Number(match[1]);

  if (
    text.includes("under") ||
    text.includes("below") ||
    text.includes("less than")
  ) {
    return { max: amount };
  }

  if (
    text.includes("above") ||
    text.includes("over") ||
    text.includes("more than")
  ) {
    return { min: amount };
  }

  return null;
}


 
useEffect(() => {
  fetch("https://dummyjson.com/products?limit=194")
    .then(res => res.json())
    .then(data => setProducts(data.products))
    .catch(console.error);
}, []);


const handleRecommend = async () => {
  setLoading(true);
  setHasSearched(true);

  try {
    const filtered = getRecommendations(preference, products);
    setRecommended(filtered);
  } catch (err) {
    console.error(err);
    setRecommended([]);
  } finally {
    setLoading(false);
  }
};



  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Personal Shopper</h1>
        <p style={styles.subtitle}>Tell me what you're looking for (e.g., "Fragrances under $80")</p>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search preferences..."
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
          />
          <button onClick={handleRecommend} disabled={loading || !preference} style={styles.button}>
            {loading ? "Searching..." : "Recommend"}
          </button>
        </div>

        {hasSearched && (
          <div style={styles.resultsContainer}>
            <h2 style={styles.sectionTitle}>Recommendations</h2>
            {recommended.length > 0 ? (
              <div style={styles.grid}>
                {recommended.map((product) => (
                  <div key={product.id} style={styles.productCard}>
                    <img src={product.thumbnail} alt={product.title} style={styles.image} />
                    <div style={styles.productInfo}>
                      <span style={styles.productTitle}>{product.title}</span>
                      <span style={styles.productPrice}>${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <p style={styles.noResults}>No matches found. Try a different preference!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a", // Dark navy
    color: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "60px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    textAlign: "center",
    padding: "20px",
  },
  title: { fontSize: "2.5rem", marginBottom: "10px", color: "#38bdf8" },
  subtitle: { color: "#94a3b8", marginBottom: "30px" },
  searchBox: { display: "flex", gap: "10px", marginBottom: "40px" },
  input: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#0284c7",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  productCard: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #334155",
    textAlign: "left",
  },
  image: { width: "100%", height: "150px", objectFit: "cover" },
  productInfo: { padding: "12px", display: "flex", flexDirection: "column" },
  productTitle: { fontWeight: "bold", fontSize: "0.9rem", marginBottom: "5px" },
  productPrice: { color: "#38bdf8", fontWeight: "bold" },
  noResults: { color: "#ef4444", marginTop: "20px" },
  sectionTitle: { borderBottom: "1px solid #334155", paddingBottom: "10px", textAlign: "left" }
};

export default App;