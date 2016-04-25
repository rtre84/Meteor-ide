Projects.allow({
	insert: function (userId, doc) {
		return Projects.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Projects.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Projects.userCanRemove(userId, doc);
	}
});

Projects.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Projects.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Projects.before.remove(function(userId, doc) {
	
});

Projects.after.insert(function(userId, doc) {
	
var newId = FileSystem.insert({ projectId: doc._id, filename: doc.name, type: 'dir', expanded: true }); FileSystem.insert({ projectId: doc._id, parentId: newId, filename: 'README.md', type: 'item', content: '# ' + doc.name + '\n\n' + doc.description + '\n' });
});

Projects.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Projects.after.remove(function(userId, doc) {
	
});
