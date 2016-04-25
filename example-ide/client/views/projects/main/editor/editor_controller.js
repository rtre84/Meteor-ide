this.ProjectsMainEditorController = RouteController.extend({
	template: "ProjectsMain",
	layoutTemplate: "ProjectsMain",

	yieldTemplates: {
		'ProjectsMainEditor': { to: 'ProjectsMainSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("ProjectsMain"); this.render("loading", { to: "ProjectsMainSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("project_files", this.params.projectId),
			Meteor.subscribe("file", this.params.fileId),
			Meteor.subscribe("project", this.params.projectId)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			project_files: FileSystem.find({projectId:this.params.projectId}, {sort:["filename"]}),
			file: FileSystem.findOne({_id:this.params.fileId}, {}),
			project: Projects.findOne({_id:this.params.projectId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});