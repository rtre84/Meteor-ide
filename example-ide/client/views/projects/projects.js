var pageSession = new ReactiveDict();

Template.Projects.rendered = function() {
	
};

Template.Projects.events({
	
});

Template.Projects.helpers({
	
});

var ProjectsListItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ProjectsListSearchString");
	var sortBy = pageSession.get("ProjectsListSortBy");
	var sortAscending = pageSession.get("ProjectsListSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "description"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var ProjectsListExport = function(cursor, fileType) {
	var data = ProjectsListItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ProjectsList.rendered = function() {
	pageSession.set("ProjectsListStyle", "table");
	
};

Template.ProjectsList.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("ProjectsListSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("ProjectsListSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("ProjectsListSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("projects.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ProjectsListExport(this.projects, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ProjectsListExport(this.projects, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ProjectsListExport(this.projects, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ProjectsListExport(this.projects, "json");
	}

	
});

Template.ProjectsList.helpers({

	"insertButtonClass": function() {
		return Projects.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.projects || this.projects.count() == 0;
	},
	"isNotEmpty": function() {
		return this.projects && this.projects.count() > 0;
	},
	"isNotFound": function() {
		return this.projects && pageSession.get("ProjectsListSearchString") && ProjectsListItems(this.projects).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ProjectsListSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ProjectsListStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ProjectsListStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ProjectsListStyle") == "gallery";
	}

	
});


Template.ProjectsListTable.rendered = function() {
	
};

Template.ProjectsListTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ProjectsListSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ProjectsListSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ProjectsListSortAscending") || false;
			pageSession.set("ProjectsListSortAscending", !sortAscending);
		} else {
			pageSession.set("ProjectsListSortAscending", true);
		}
	}
});

Template.ProjectsListTable.helpers({
	"tableItems": function() {
		return ProjectsListItems(this.projects);
	}
});


Template.ProjectsListTableItems.rendered = function() {
	
};

Template.ProjectsListTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("projects.main", {projectId: this._id, fileId: null});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Projects.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Projects.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("projects.edit", {projectId: this._id, fileId: null});
		return false;
	}
});

Template.ProjectsListTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Projects.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Projects.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
