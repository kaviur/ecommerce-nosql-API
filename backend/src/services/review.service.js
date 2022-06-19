import { reviewModel } from '../models/index.js';


export default class ReviewService {
    
    async createReview(data) {
        try {
            const userHasAlreadyReviewed = await reviewModel.findOne({ userID: data.userID, productID: data.productID });
            if (userHasAlreadyReviewed) {
                return { success: false, error: "You have already reviewed this product" };
            }
            const review = await reviewModel.create(data);
            return { success: true, review };
        } catch (error) {
            return { success: false, error };
        }
    }

    async getReviewById(id) {
        try {
            const review = await reviewModel.findById(id).populate('userID', 'name');
            return { success: true, review };
        } catch (error) {
            return { success: false, error };
        }
    }

    async getReviewsByProductId(id) {
        try {
            const reviews = await reviewModel.find({ productID: id }).populate('userID', 'name');
            return { success: true, reviews };
        } catch (error) {
            return { success: false, error };
        }
    }
    
    async getReviewsByUserId(id) {
        try {
            const reviews = await reviewModel.find({ userID: id }).populate('productID', 'name');
            return { success: true, reviews };
        } catch (error) {
            return { success: false, error };
        }
    }

    async updateReview(id, stars, title, comment, userID) {
        try {
            const review = await reviewModel.findById(id);
            if (review.userID.toString() !== userID) {
                return { success: false, error: "You are not allowed to update this review" };
            }
            review.stars = stars || review.stars;
            review.title = title || review.title;
            review.comment = comment || review.comment;
            await review.save();
            return { success: true, review };
        } catch (error) {
            return { success: false, error };
        }
    }

    async deleteReview(id, userID, role) {
        try {
            const review = await reviewModel.findById(id);
            if (!review){
                return { success: false, error: "Review not found" };
            }
            if (review.userID.toString() !== userID ) {
                if(role == 3) {
                    await review.remove();
                    return { success: true, message: "Review deleted" };
                }
                return { success: false, error: "You are not allowed to delete this review" };
            }
            await review.remove();

            //await reviewModel.findByIdAndDelete(id);
            return { success: true, message: "Review was successfully deleted" };
        } catch (error) {
            return { success: false, error };
        }
    }
}

