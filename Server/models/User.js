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

    async deleteUserByEmail(email) {
      return this.collection.deleteOne({ email });
    }
  }
  
  module.exports = User;