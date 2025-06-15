import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Modal, notification } from 'antd';
import { rateApi } from '../../rateApi';

interface AddAttractionRatePopupProps {
    onClose?: () => void;
    isVisible?: boolean;
    attractionId: string;
    attractionName?: string;
}

export const AddAttractionRatePopup: React.FC<AddAttractionRatePopupProps> = ({
    onClose,
    isVisible = true,
    attractionId,
    attractionName
}) => {
    // ✅ Add missing state variables
    const [selectedStars, setSelectedStars] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // ✅ Add missing handleStarClick function
    const handleStarClick = (rating: number) => {
        setSelectedStars(rating);
    };

    // ✅ Add missing handleSubmitReview function
    const handleSubmitReview = async (): Promise<void> => {
        if (selectedStars > 0 && comment.trim()) {
            try {
                console.log(`🚀 ~ AddAttractionRatePopup.tsx:38 ~ handleSubmitReview ~ attractionId:`, attractionId)
                setIsSubmitting(true);
                const response = await rateApi.submitRate(attractionId, {
                    star: selectedStars,
                    comment: comment.trim()
                });

                if (response.success) {
                    notification.success({
                        message: 'Success',
                        description: 'Your review has been submitted successfully!',
                        placement: 'topRight',
                    });
                    // Reset form after submission
                    setSelectedStars(0);
                    setComment('');
                    // TODO: Refresh the reviews list
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'An error occurred while submitting your review. Please try again later.',
                        placement: 'topRight',
                    });
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                notification.error({
                    message: 'Error',
                    description: 'An error occurred while submitting your review. Please try again later.',
                    placement: 'topRight',
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    // ✅ Add function to reset form
    const resetForm = () => {
        setSelectedStars(0);
        setComment('');
        setIsSubmitting(false);
    };

    // Don't render if not visible
    if (!isVisible) {
        return null;
    }

    return (
        <Modal
            open={isVisible}
            onCancel={onClose}
            footer={null}
            centered
            width={800}
            // className="max-w-3xl mx-auto"
            destroyOnClose
            maskClosable={true}
            closable={false} // Disable default close button to use custom one
        >
            {/* <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"> */}
                <div className="bg-white rounded-lg w-full overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {attractionName}
                            {/* {attractionName && (
                                <span className="block text-sm font-normal text-gray-600 mt-1">
                                    for {attractionName}
                                </span>
                            )} */}
                        </h2>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
                            <div className="flex flex-col md:flex-row gap-10">
                                {/* Rating Section */}
                                <div className='w-[30%]'>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 ">
                                        Rate Your Experience
                                    </h3>
                                    <div className="flex items-center space-x-2 mb-4 ">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Star
                                                key={index}
                                                onClick={() => handleStarClick(index + 1)}
                                                className={`w-6 md:w-8 cursor-pointer transition-colors duration-200 ${index < selectedStars
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300 hover:text-yellow-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {selectedStars > 0
                                            ? `You selected ${selectedStars} star${selectedStars > 1 ? 's' : ''}`
                                            : 'Select your rating (required)'}
                                    </p>
                                </div>

                                {/* Comment Section */}
                                <div className="space-y-4 w-[60%]">
                                    <div>
                                        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Review
                                        </label>
                                        <textarea
                                            id="review-comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share your experience..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-150 min-h-[150px] resize-vertical"
                                            maxLength={1000}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {comment.length}/1000 characters
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                 {onClose && (
                                    <button
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="flex-1 sm:flex-none bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={selectedStars === 0 || !comment.trim() || isSubmitting}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </Modal>
    );
};