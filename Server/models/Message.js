class Message {
    constructor(db) {
        this.collection = db.collection('Messages');
    }

    async createMessage(messageData) {
        return this.collection.insertOne(messageData);
    }

    async getLastMessages(limit = 1000) {
        return this.collection.find()
            .sort({ timestamp: 1 })
            .limit(limit)
            .toArray();
    }

    async deleteMessage(messageId) {
        return this.collection.deleteOne({ messageId });
    }

    async updateMessage(messageId, newContent) {
        return this.collection.updateOne(
            { messageId },
            {
                $set: {
                    message: newContent,
                    edited: true,
                    editedAt: new Date().toISOString()
                }
            }
        );
    }

}

module.exports = Message;
