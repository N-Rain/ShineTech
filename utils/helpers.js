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
      return "Hết hàng"; // Hết hàng
    } else if (stock <= 1) {
      return "Hết hàng"; // Hết hàng, stock <= 1
    } else if (stock <= 10) {
      return "Tồn kho thấp"; // Tồn kho thấp
    }
    return null; // Còn hàng
  };
  
export const updateSoldCount = (sold) => {
  return sold ? `Đã bán ${sold}` : "Chưa có lượt bán";
}
