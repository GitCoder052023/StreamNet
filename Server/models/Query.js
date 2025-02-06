class Query {
    constructor(db) {
        this.collection = db.collection('Queries');
    }

    async createQuery(queryData) {
        return this.collection.insertOne({
            ...queryData,
            createdAt: new Date(),
            status: 'pending'
        });
    }
}

module.exports = Query;
