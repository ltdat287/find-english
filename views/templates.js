// Enter your templates and postbacks here for clarification of code
// Right now there are two examples here.
let templates = {
	answer: {
		attachment: {
			type: "template",
			payload: {
				template_type: "button",
				text: "Hello and welcome to your first bot. Would you like to get see our products?",
				buttons: [
					{
						type: "web_url",
						url: "https://www.messenger.com",
						title: "Visit Messenger"
					}
				]
			}
		}
	}
};

module.exports = {
	templates: templates
};