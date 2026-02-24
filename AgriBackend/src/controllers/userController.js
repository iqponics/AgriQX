const userRepository = require('../repositories/userRepository');
const userService = require('../services/userService');

const userController = {
    updateUser: async (req, res) => {
        if (req.user.id !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You can update only your account' });
        }

        if (req.body.password) {
            try {
                req.body.password = await userService.hashPassword(req.body.password);
            } catch (err) {
                return res.status(500).json({ message: 'Failed to hash password', error: err.message });
            }
        }

        try {
            const user = await userRepository.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Failed to update user', error: err.message });
        }
    },

    deleteUser: async (req, res) => {
        if (req.user.id !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You can delete only your account' });
        }

        try {
            await userRepository.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete user', error: err.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await userRepository.findById(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const currentUser = await userRepository.findById(req.user.id);

            const isRequestSent = currentUser.sentContact.some(id =>
                id.equals(req.params.userId)
            );

            const { password, updatedAt, isAdmin, ...others } = user._doc;
            res.status(200).json({ ...others, isRequestSent });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch user', error: err.message });
        }
    },

    getContacts: async (req, res) => {
        try {
            const user = await userRepository.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const contacts = await Promise.all(
                user.contacts.map(async (contactId) => {
                    const contact = await userRepository.findById(contactId);
                    return {
                        _id: contact._id,
                        firstname: contact.firstname,
                        lastname: contact.lastname,
                        isAstrologer: contact.isAstrologer,
                        profilePic: contact.profilePic ? `/uploads/${contact.profilePic}` : null,
                    };
                })
            );

            res.status(200).json(contacts);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch contacts', error: err.message });
        }
    },

    requestConnect: async (req, res) => {
        if (req.user.id === req.params.id) {
            return res.status(403).json({ message: "You can't follow yourself" });
        }

        try {
            const user = await userRepository.findById(req.user.id);
            const to_user = await userRepository.findById(req.params.id);

            if (!to_user.contacts.includes(req.user.id)) {
                await userRepository.updateById(to_user._id, { $push: { pendingContacts: { contactorId: req.user.id, seen: false } } });
                await userRepository.updateById(user._id, { $push: { sentContact: req.params.id } });
                res.status(200).json({ message: 'Request Sent!' });
            } else {
                res.status(403).json({ message: 'Already connected' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Failed to send request', error: err.message });
        }
    },

    acceptConnect: async (req, res) => {
        try {
            const user = await userRepository.findById(req.user.id);
            const contactor = await userRepository.findById(req.params.id);

            if (user.contacts.includes(contactor._id)) {
                return res.status(403).json({ message: 'Already connected' });
            }

            await userRepository.updateById(user._id, { $push: { contacts: contactor._id } });
            await userRepository.updateById(contactor._id, { $push: { contacts: user._id } });

            await userRepository.updateById(user._id, { $pull: { pendingContacts: { contactorId: contactor._id } } });
            await userRepository.updateById(contactor._id, { $pull: { sentContact: user._id } });

            res.status(200).json({ message: 'Request Accepted!' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to accept request', error: err.message });
        }
    },

    deleteConnect: async (req, res) => {
        if (req.user.id === req.params.id) {
            return res.status(403).json({ message: "You can't disconnect yourself" });
        }

        try {
            const user = await userRepository.findById(req.user.id);
            const to_user = await userRepository.findById(req.params.id);

            if (to_user.contacts.includes(req.user.id)) {
                await userRepository.updateById(to_user._id, { $pull: { contacts: req.user.id } });
                await userRepository.updateById(user._id, { $pull: { contacts: req.params.id } });
                res.status(200).json({ message: 'Connection Deleted!' });
            } else {
                res.status(403).json({ message: 'Not connected' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete connection', error: err.message });
        }
    },

    withdrawRequest: async (req, res) => {
        try {
            const user = await userRepository.findById(req.user.id);
            const targetUser = await userRepository.findById(req.params.id);

            await userRepository.updateById(user._id, { $pull: { sentContact: req.params.id } });
            await userRepository.updateById(targetUser._id, {
                $pull: { pendingContacts: { contactorId: req.user.id } }
            });

            res.status(200).json({ message: 'Request withdrawn' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    declineConnect: async (req, res) => {
        try {
            const user = await userRepository.findById(req.user.id);
            const contactor = await userRepository.findById(req.params.id);

            await userRepository.updateById(user._id, {
                $pull: { pendingContacts: { contactorId: req.params.id } }
            });
            await userRepository.updateById(contactor._id, { $pull: { sentContact: req.user.id } });

            res.status(200).json({ message: 'Request declined' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    searchAstrologers: async (req, res) => {
        try {
            const { name, city } = req.body;
            const query = userService.getAstrologerSearchQuery(name, city);
            const users = await userRepository.find(query);
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Failed to search astrologers', error: err.message });
        }
    },

    searchUsers: async (req, res) => {
        try {
            const firstname = req.query.firstname || req.body.firstname;
            const lastname = req.query.lastname || req.body.lastname;
            const query = userService.getUserSearchQuery(firstname, lastname);
            const users = await userRepository.find(query);
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Failed to search users', error: err.message });
        }
    },

    rateUser: async (req, res) => {
        try {
            const user = await userRepository.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const existingRating = user.rating.find((r) => r.userId === req.user.id);
            if (existingRating) {
                existingRating.rating = req.body.rating;
            } else {
                user.rating.push({ userId: req.user.id, rating: req.body.rating });
            }

            await userRepository.saveUser(user);
            res.status(200).json({ message: 'Rating updated successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update rating', error: err.message });
        }
    },

    updateVerification: async (req, res) => {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'You can update only your account' });
        }

        try {
            const { verificationDocuments } = req.body;
            const user = await userRepository.findByIdAndUpdate(
                req.params.id,
                {
                    $push: { verificationDocuments: { $each: verificationDocuments } },
                    $set: { status: 'Pending' }
                }
            );
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Failed to update verification', error: err.message });
        }
    }
};

module.exports = userController;
