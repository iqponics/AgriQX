const postRepository = require('../repositories/postRepository');
const userRepository = require('../repositories/userRepository');
const postService = require('../services/postService');

const postController = {
    createPost: async (req, res) => {
        try {
            const postData = req.body;
            if (req.file) {
                postData.img = req.file.path;
                postData.fileName = req.file.filename;
            }
            const savedPost = await postRepository.createPost(postData);
            const postUser = await userRepository.findById(savedPost.userId);
            res.status(200).json({
                ...savedPost.toObject(),
                profilePic: postUser?.profilePic,
                firstname: postUser?.firstname,
                lastname: postUser?.lastname
            });
        } catch (err) {
            console.error("Error saving post:", err);
            res.status(500).json(err);
        }
    },

    updatePost: async (req, res) => {
        try {
            const post = await postRepository.findById(req.params.id);
            if (post.userId.toString() === req.body.userId) {
                await postRepository.updateById(req.params.id, { $set: req.body });
                res.status(200).json("Post Updated");
            } else {
                res.status(403).json("You can update only your Posts");
            }
        } catch (err) {
            console.error("Error updating post:", err);
            res.status(500).json(err);
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await postRepository.findById(req.params.id);
            if (post.userId.toString() === req.params.userId) {
                await postRepository.deletePost(req.params.id);
                res.status(200).json("Post deleted");
            } else {
                res.status(403).json("You can delete only your Posts");
            }
        } catch (err) {
            console.error("Error deleting post:", err);
            res.status(500).json(err);
        }
    },

    likePost: async (req, res) => {
        try {
            const post = await postRepository.findById(req.params.id);
            if (!post.likes.includes(req.body.userId)) {
                await postRepository.updateById(post._id, { $push: { likes: req.body.userId } });
                res.status(200).json("Liked");
            } else {
                await postRepository.updateById(post._id, { $pull: { likes: req.body.userId } });
                res.status(200).json("UnLiked");
            }
        } catch (err) {
            console.error("Error updating likes:", err);
            res.status(500).json(err);
        }
    },

    addComment: async (req, res) => {
        try {
            const post = await postRepository.findById(req.params.id);
            if (!req.body.userId || !req.body.comment) {
                return res.status(400).json({ error: "Missing comment userId or comment" });
            }
            await postRepository.updateById(post._id, { $push: { comments: req.body } });
            res.status(200).json("Comment Posted!");
        } catch (err) {
            console.error("Error adding comment:", err);
            res.status(500).json(err);
        }
    },

    getPost: async (req, res) => {
        try {
            const post = await postRepository.findById(req.params.id);
            const postWithDetails = await postService.getPostWithProfilePic(post);
            res.status(200).json(postWithDetails);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getFeed: async (req, res) => {
        try {
            const user = await userRepository.findById(req.params.userId);
            const feedPosts = await postService.getFeedPosts(user);
            res.status(200).json(feedPosts);
        } catch (err) {
            console.error("Error fetching feed:", err);
            res.status(500).json(err);
        }
    },

    getTimeline: async (req, res) => {
        try {
            const user = await userRepository.findById(req.params.userId);
            const userPosts = await postRepository.find({ userId: user._id });
            res.status(200).json(userPosts);
        } catch (err) {
            console.error("Error fetching timeline:", err);
            res.status(500).json(err);
        }
    }
};

module.exports = postController;
