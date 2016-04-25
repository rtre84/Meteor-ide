Meteor.publish("project_files", function(projectId) {
	return FileSystem.find({projectId:projectId,createdBy:this.userId}, {sort:["filename"]});
});

Meteor.publish("file", function(fileId) {
	return FileSystem.find({_id:fileId,createdBy:this.userId}, {});
});

