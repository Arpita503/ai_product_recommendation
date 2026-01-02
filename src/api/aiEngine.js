
function detectCategory(text) {
  text = text.toLowerCase();

  const categoryKeywords = {
    groceries: ["fruit", "fruits", "vegetable", "food", "snack"],
    smartphones: ["phone", "mobile", "smartphone"],
    laptops: ["laptop", "notebook", "macbook"],
    fragrances: ["perfume", "fragrance", "scent"],
    makeup: ["skincare", "cream", "lotion", "serum"]
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(word => text.includes(word))) {
      return category; 
    }
  }

  return "all";
}


function extractBudget(text) {
  text = text.toLowerCase();

  const match = text.match(/\$?(\d+)/);
  if (!match) return null;

  const amount = Number(match[1]);

  if (text.includes("under") || text.includes("below") || text.includes("less")) {
    return { max: amount };
  }

  if (text.includes("above") || text.includes("over") || text.includes("more")) {
    return { min: amount };
  }

  return null;
}


export function getRecommendations(userInput, products) {
  if (!products || products.length === 0) return [];

  const category = detectCategory(userInput);
  const budget = extractBudget(userInput);

  let filtered = [...products];


  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (budget?.max) {
    filtered = filtered.filter(p => p.price <= budget.max);
  }

  if (budget?.min) {
    filtered = filtered.filter(p => p.price >= budget.min);
  }


  return filtered.slice(0, 6);
}
