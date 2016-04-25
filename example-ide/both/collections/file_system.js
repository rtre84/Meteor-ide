this.FileSystem = new Mongo.Collection("file_system");

this.FileSystem.userCanInsert = function(userId, doc) {
	return true;
};

this.FileSystem.userCanUpdate = function(userId, doc) {
	return userId && doc.createdBy == userId;
};

this.FileSystem.userCanRemove = function(userId, doc) {
	return userId && doc.createdBy == userId;
};
