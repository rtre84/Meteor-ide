var pageSession = new ReactiveDict();

Template.ProjectsMainEditor.rendered = function() {
	
};

Template.ProjectsMainEditor.events({
	
});

Template.ProjectsMainEditor.helpers({
	
});


var ProjectsMainEditorTreeGotoFirstLink = function() {
	var firstLink = $(".tree-view-item-link");
	if(!firstLink.length) {
		firstLink = $(".tree-view-dir-link");
	}
	if(firstLink.length) {
		firstLink.click();
	}	
}

Template.ProjectsMainEditorTree.rendered = function() {
	var fileId = this.data.params.fileId;

	if(!fileId || fileId == "null") {
		ProjectsMainEditorTreeGotoFirstLink();
		return;
	}
	pageSession.set("ProjectsMainEditorTreeSelectedItem", fileId);
};

Template.ProjectsMainEditorTree.events({

});

Template.ProjectsMainEditorTree.helpers({

});


Template.ProjectsMainEditorTreeDirs.rendered = function() {
}

Template.ProjectsMainEditorTreeDirs.events({
	"click .tree-view-dir-link": function(e, t) {
		pageSession.set("ProjectsMainEditorTreeSelectedItem", this._id);
		if(e.target != e.currentTarget) return true;
		e.preventDefault();
		FileSystem.update({ _id: this._id }, { $set: { expanded: !this.expanded } });

		Router.go("projects.main.editor", {projectId: this.projectId, fileId: this._id});
		return false;
	},
	"click .tree-view-dir-rename": function(e, t) {
		var data = {
			data: this,
			mode: "rename",
			filename: this.filename
		};

		bootboxDialog("ProjectsMainEditorTreeFilenameModal", data, {
			title: "Rename",
			animate: false
		});
	},
	"click .tree-view-dir-new-file": function(e, t) {
		var data = {
			data: this,
			mode: "new-file",
			filename: ""
		};

		bootboxDialog("ProjectsMainEditorTreeFilenameModal", data, {
			title: "New File",
			animate: false
		});
	},
	"click .tree-view-dir-new-dir": function(e, t) {
		var data = {
			data: this,
			mode: "new-dir",
			filename: ""
		};

		bootboxDialog("ProjectsMainEditorTreeFilenameModal", data, {
			title: "New Folder",
			animate: false
		});
	},

	"click .tree-view-dir-delete": function(e, t) {
		e.preventDefault();
		var self = this;
		bootbox.dialog({
			message: "Delete \"" + self.filename + "\"?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						FileSystem.remove({ _id: self._id }, function(e, r) {
							ProjectsMainEditorTreeGotoFirstLink();
						});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.ProjectsMainEditorTreeDirs.helpers({
	"dirs": function() {
		return FileSystem.find({ parentId: this.parentId, type: "dir" });
	},
	"dirItemClass": function() {
		return this.expanded ? "" : "collapsed";
	},
	"dirIconClass": function() {
		return this.expanded ? "fa fa-caret-down" : "fa fa-caret-right";
	},
	"itemClass": function() {
		return this._id === pageSession.get("ProjectsMainEditorTreeSelectedItem") ? "active" : "";
	},
	"gotParent": function() {
		return !!this.parentId;
	}
});

Template.ProjectsMainEditorTreeItems.events({
	"click .tree-view-item-link": function(e, t) {
		pageSession.set("ProjectsMainEditorTreeSelectedItem", this._id);
		if(e.target != e.currentTarget) return true;
		e.preventDefault();
		Router.go("projects.main.editor", {projectId: this.projectId, fileId: this._id});
		return false;
	},

	"click .tree-view-item-rename": function(e, t) {
		var data = {
			data: this,
			mode: "rename",
			filename: this.filename
		};

		bootboxDialog("ProjectsMainEditorTreeFilenameModal", data, {
			title: "Rename",
			animate: false
		});
	},

	"click .tree-view-item-delete": function(e, t) {
		e.preventDefault();
		var self = this;
		bootbox.dialog({
			message: "Delete \"" + self.filename + "\"?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						FileSystem.remove({ _id: self._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.ProjectsMainEditorTreeItems.helpers({
	"items": function() {
		return FileSystem.find({ parentId: this.parentId, type: "item" });
	},
	"itemClass": function() {
		return this._id === pageSession.get("ProjectsMainEditorTreeSelectedItem") ? "active" : "";
	}
});


Template.ProjectsMainEditorTreeFilenameModal.rendered = function() {
	pageSession.set("ProjectsMainEditorTreeFilenameModalErrorMessage", "");
	$("input[autofocus]").focus();
};

Template.ProjectsMainEditorTreeFilenameModal.helpers({
	"ProjectsMainEditorTreeFilenameModalErrorMessage": function() {
		return pageSession.get("ProjectsMainEditorTreeFilenameModalErrorMessage");
	}
});

Template.ProjectsMainEditorTreeFilenameModal.events({
	"submit": function(e, t) {
		var self = this;
		pageSession.set("ProjectsMainEditorTreeFilenameModalErrorMessage", "");

		function submitAction(newId) {
			bootbox.hideAll();
			if(newId) {
				FileSystem.update({ _id: self.data._id }, { $set: { expanded: true } }, function(e) {
					$("a[data-id='" + newId + "']").click();
				});
			}
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("ProjectsMainEditorTreeFilenameModalErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				if(self.mode === "rename") {
					var duplicate = FileSystem.findOne({ _id: { $ne: self.data._id }, parentId: self.data.parentId, filename: values.filename });
					if(duplicate) {
						errorAction("\"" + values.filename + "\" already exists.");
						return false;
					}

					FileSystem.update({ _id: self.data._id }, { $set: { filename: values.filename } }, function(e) { 
						if(e)
							errorAction(e.message);
						else
							submitAction(); 
					});
				}

				if(self.mode == "new-file") {
					var duplicate = FileSystem.findOne({ _id: { $ne: self.data._id }, parentId: self.data._id, filename: values.filename });
					if(duplicate) {
						errorAction("\"" + values.filename + "\" already exists.");
						return false;
					}


					var val = {projectId:self.data.projectId};
					var itemNameField = "filename";
					if(itemNameField) val[itemNameField] = values.filename;
					val.parentId = self.data._id;
					val.type = "item";

					FileSystem.insert(val, function(e, r) {
						if(e)
							errorAction(e.message);
						else
							submitAction(r); 
					});
				}

				if(self.mode == "new-dir") {
					var duplicate = FileSystem.findOne({ _id: { $ne: self.data._id }, parentId: self.data._id, filename: values.filename });
					if(duplicate) {
						errorAction("\"" + values.filename + "\" already exists.");
						return false;
					}

					var val = {projectId:self.data.projectId};
					var itemNameField = "filename";
					if(itemNameField) val[itemNameField] = values.filename;
					val.parentId = self.data._id;
					val.type = "dir";

					FileSystem.insert(val, function(e, r) {
						if(e)
							errorAction(e.message);
						else
							submitAction(r);
					});
				}
			}
		);

		return false;

	},

	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		bootbox.hideAll();

		return false;
	}
});

Template.ProjectsMainEditorView.rendered = function() {
	function setFullHeight() {
		if(!$(".CodeMirror").length) return;

		var viewHeight = $(window).height();
		var footerHeight = $("#footer").outerHeight();
		var codeTop = $(".CodeMirror").offset().top;

		var availableHeight = viewHeight - footerHeight - codeTop;
		if(availableHeight < 200) {
			availableHeight = 200;
		}

		$(".CodeMirror").height(availableHeight);
		$(".full-height").height(availableHeight);
	}

	// set full height on window resize
	$(window).resize(function() {
		setFullHeight();
	});

	// full height initialy
	setFullHeight();

	// initial text
	var fileContent = (this.data.params.fileId && this.data.file) ? this.data.file.content : "";
	Session.set("editorText", fileContent);
};

Template.ProjectsMainEditorView.events({
	"click .file-save": function(e, t) {
		var content = Session.get("editorText");
		FileSystem.update({ _id: this.params.fileId }, { $set: { content: content } }, function(e, t) {
			if(e) {
				alert("Unable to save!\n\n" + e.message);
			}
		});
	}
});

Template.ProjectsMainEditorView.helpers({
	"isFile": function() {
		return this.file && this.file.type === "item";
	},

	"editorOptions": function() {
		var options = {
            styleActiveLine: true,
			lineNumbers: true,
			keyMap: "sublime",
			theme: "blackboard",
			lint: false
		};

		if(this.file && this.file.filename) {
			var ext = this.file.filename.split('.').pop();
			switch(ext) {
				case "json": { options.mode = "application/ld+json"; options.lint = true; } break;
				case "js": { options.mode = "javascript"; options.lint = true; } break;
				case "html": { options.mode = "htmlmixed"; options.lint = false; } break;
				case "md": { options.mode = "markdown"; options.lint = false; } break;
			}
		}

		if(options.lint) options.gutters = ["CodeMirror-lint-markers"];

		return options;
	},
	"editorText": function() {
		return Session.get("editorText");
	}
});
