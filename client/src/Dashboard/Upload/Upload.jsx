import React, { useState } from 'react';

const Upload = () => {
    const [formData, setFormData] = useState({
        video: null,
        title: '',
        location: '',
        hashtags: '',
        topics: '',
    });
    const [videoPreview, setVideoPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                video: file,
            });
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <div className="p-4 mb-20 lg:p-8 min-h-[90vh] bg-white flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 w-full text-center lg:text-start shadow-sm shadow-b-gray-300 py-2 mb-4">Upload Video</h1>
            {/* Form Section */}
            <div className='w-full h-full lg:h-[70vh] flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-x-4 ' >
                <div className="w-full lg:w-1/2  flex items-center justify-center">
                    {videoPreview ? (
                        <video
                            src={videoPreview}
                            controls
                            className="max-w-full lg:h-full h-80 lg:max-h-[70vh] rounded-lg shadow-lg"
                        />
                    ) : (
                        <p className="text-gray-500 text-lg">No video selected</p>
                    )}
                </div>
                <div className="w-full lg:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center justify-center">

                        <div className='w-full'>
                            <label className="block font-semibold text-gray-700 mb-2">Upload Video (MP4)</label>
                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={handleVideoChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className='w-full'> 
                            <label className="block font-semibold text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter Title"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div >

                        <div className='w-full'>
                            <label className="block font-semibold text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Enter Location"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <div className='w-full'>
                            <label className="block font-semibold text-gray-700 mb-2">Hashtags</label>
                            <input
                                type="text"
                                name="hashtags"
                                value={formData.hashtags}
                                onChange={handleInputChange}
                                placeholder="#hashtag1 #hashtag2"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-red-600 text-white py-2 w-full rounded-lg font-semibold hover:bg-red-500 transition"
                        >
                            Upload
                        </button>
                    </form>
                </div>
            </div>
            {/* Video Preview Section */}

        </div>
    );
};

export default Upload;
