export function calculateAverageRating(ratings) {
    let totalRating = 0;
    for (const ratingObj of ratings) {
      totalRating += ratingObj.rating;
    }
    const averageRating = totalRating / ratings.length;
    return averageRating;
  }
  
  export const stockStatus = (stock) => {
    if (stock === 0) {
      return "Out of Stock"; // Hết hàng
    } else if (stock <= 1) {
      return "Hết hàng"; // Hết hàng, stock <= 1
    } else if (stock <= 10) {
      return "Low Stock"; // Tồn kho thấp
    }
    return null; // Còn hàng
  };
  
export const updateSoldCount = (sold) => {
  return sold ? `${sold} items sold` : "No sales yet";
}
