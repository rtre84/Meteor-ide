var pageSession = new ReactiveDict();

Template.ProjectsInsert.rendered = function() {
	
};

Template.ProjectsInsert.events({
	
});

Template.ProjectsInsert.helpers({
	
});

Template.ProjectsInsertForm.rendered = function() {
	

	pageSession.set("projectsInsertFormInfoMessage", "");
	pageSession.set("projectsInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ProjectsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("projectsInsertFormInfoMessage", "");
		pageSession.set("projectsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var projectsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(projectsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("projectsInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("projects.main", {projectId: newId, fileId: null});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("projectsInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Projects.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("projects", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ProjectsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("projectsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("projectsInsertFormErrorMessage");
	}
	
});
