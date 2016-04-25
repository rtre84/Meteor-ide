FileSystem.allow({
	insert: function (userId, doc) {
		return FileSystem.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return FileSystem.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return FileSystem.userCanRemove(userId, doc);
	}
});

FileSystem.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

FileSystem.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

FileSystem.before.remove(function(userId, doc) {
	
});

FileSystem.after.insert(function(userId, doc) {
	
});

FileSystem.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

FileSystem.after.remove(function(userId, doc) {
	
FileSystem.remove({ parentId: doc._id });
});
