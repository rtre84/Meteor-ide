Meteor.publish("projects", function() {
	return Projects.find({createdBy:this.userId}, {});
});

Meteor.publish("project", function(projectId) {
	return Projects.find({_id:projectId,createdBy:this.userId}, {});
});

Meteor.publish("project_empty", function() {
	return Projects.find({_id:null,createdBy:this.userId}, {});
});

