const Post = require('../models/Post');

const postRepository = {
    createPost: async (postData) => {
        const newPost = new Post(postData);
        return await newPost.save();
    },

    findById: async (id) => {
        return await Post.findById(id);
    },

    findByIdAndUpdate: async (id, data, options = { new: true }) => {
        return await Post.findByIdAndUpdate(id, data, options);
    },

    updateById: async (id, update) => {
        return await Post.updateOne({ _id: id }, update);
    },

    deletePost: async (id) => {
        return await Post.deleteOne({ _id: id });
    },

    find: async (query) => {
        return await Post.find(query);
    },

    findLatestByUserId: async (userId) => {
        return await Post.find({ userId });
    }
};

module.exports = postRepository;
