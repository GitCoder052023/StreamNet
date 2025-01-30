class User {
    constructor(db) {
      this.collection = db.collection('Users');
    }
  
    async createUser(userData) {
      return this.collection.insertOne(userData);
    }
  
    async findUserByEmail(email) {
      return this.collection.findOne({ email });
    }
  }
  
  module.exports = User;