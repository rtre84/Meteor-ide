var pageSession = new ReactiveDict();

Template.ProjectsEdit.rendered = function() {
	
};

Template.ProjectsEdit.events({
	
});

Template.ProjectsEdit.helpers({
	
});

Template.ProjectsEditForm.rendered = function() {
	

	pageSession.set("projectsEditFormInfoMessage", "");
	pageSession.set("projectsEditFormErrorMessage", "");

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

Template.ProjectsEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("projectsEditFormInfoMessage", "");
		pageSession.set("projectsEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var projectsEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(projectsEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("projectsEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("projects", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("projectsEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Projects.update({ _id: t.data.project._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ProjectsEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("projectsEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("projectsEditFormErrorMessage");
	}
	
});
