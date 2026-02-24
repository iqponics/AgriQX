const postRepository = require('../repositories/postRepository');
const userRepository = require('../repositories/userRepository');

const postService = {
    getPostWithProfilePic: async (post) => {
        const postUser = await userRepository.findById(post.userId);
        const updatedComments = await Promise.all(
            post.comments.map(async (comment) => {
                const commentUser = await userRepository.findById(comment.userId);
                return {
                    ...comment.toObject(),
                    profilePic: commentUser?.profilePic || null,
                };
            })
        );
        return {
            ...post.toObject(),
            profilePic: postUser?.profilePic || null,
            comments: updatedComments,
        };
    },

    getFeedPosts: async (user) => {
        const userPosts = await postRepository.find({ userId: user._id });
        const contactPosts = await Promise.all(
            user.contacts.map((contactId) => postRepository.find({ userId: contactId }))
        );

        const allPosts = userPosts.concat(...contactPosts).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return await Promise.all(
            allPosts.map(async (post) => {
                const postUser = await userRepository.findById(post.userId);
                const updatedComments = await Promise.all(
                    post.comments.map(async (c) => {
                        if (!c.profilePic) {
                            try {
                                const commentUser = await userRepository.findById(c.userId);
                                return { ...c.toObject(), profilePic: commentUser?.profilePic };
                            } catch (err) {
                                console.error("Error fetching comment user for comment:", c, err);
                                return c;
                            }
                        }
                        return c;
                    })
                );
                return {
                    ...post.toObject(),
                    profilePic: postUser?.profilePic,
                    firstname: postUser?.firstname,
                    lastname: postUser?.lastname,
                    comments: updatedComments
                };
            })
        );
    }
};

module.exports = postService;
