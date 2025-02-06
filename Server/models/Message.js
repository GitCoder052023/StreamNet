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
}

module.exports = Message;
