import { reviewModel } from '../models/index.js';


export default class ReviewService {
    
    async createReview(data) {
        try {
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

    async updateReview(id, stars, title, comment) {
        try {
            const review = await reviewModel.findById(id);
            review.stars = stars || review.stars;
            review.title = title || review.title;
            review.comment = comment || review.comment;
            await review.save();
            return { success: true, review };
        } catch (error) {
            return { success: false, error };
        }
    }

    async deleteReview(id) {
        try {
            await reviewModel.findByIdAndDelete(id);
            return { success: true, message: "Review was successfully deleted" };
        } catch (error) {
            return { success: false, error };
        }
    }
}

