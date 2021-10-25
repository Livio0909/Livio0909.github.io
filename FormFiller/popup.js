let getButton = document.getElementById("getFormAnswers");
let fillButton = document.getElementById("fillForm");
let savedForm = document.getElementById("savedForm");
let clearSavedFormButton = document.getElementById("clearSavedForm");

showSavedForm()

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.action == 'showSavedForm') {
		showSavedForm()
		return true;
	}
});

getButton.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: getFormAnswersToLocalStorage,
	});
});

fillButton.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	console.log('what')
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: fillFormFromLocalStorage,
	});
});

clearSavedFormButton.addEventListener("click", () => {
	clearSavedForm()
});

function showSavedForm() {
	
	chrome.storage.sync.get("formAnswers", (formAnswers) => {
		if (formAnswers.formAnswers) {
			document.getElementById("savedForm").innerText = 'Saved: '+formAnswers.formAnswers.formName;
			fillButton.removeAttribute('disabled')
			clearSavedFormButton.removeAttribute('hidden')
		}
	});
}

function clearSavedForm() {
	chrome.storage.sync.clear()
	fillButton.setAttribute('disabled','')
	clearSavedFormButton.setAttribute('hidden','')
	document.getElementById("savedForm").innerText = ''
}

function getFormAnswersToLocalStorage() {
	let listContainer = document.querySelectorAll('.freebirdFormviewerViewItemsItemItem:not(.freebirdFormviewerViewItemsTextTextItem)')
	let questionList = []
	
	listContainer.forEach((container) => {
		let titleElement = container.querySelector('.freebirdFormviewerViewItemsItemItemTitle')
		
		if (titleElement) {
			let title = titleElement.innerText
			
			let answerElementSingleChoice = container.querySelector(':not(.freebirdFormviewerViewItemsCheckboxCorrectAnswerBox) > label.docssharedWizToggleLabeledContainer.isChecked:not(.freebirdFormviewerViewItemsCheckboxContainer )')
			if (answerElementSingleChoice) {

				let answer = answerElementSingleChoice.querySelector('.docssharedWizToggleLabeledPrimaryText').innerText
				questionList.push({"title":title,"type":1,"answer":answer})
			}
			
			let answerElementMultipleChoice = container.querySelectorAll('.freebirdFormviewerViewItemsCheckboxContainer')
			if (answerElementMultipleChoice.length > 0) {
				let choiceList = []
				answerElementMultipleChoice.forEach((choice) => {
					if (choice.classList.contains('isChecked')) {
						choiceList.push({"choice":choice.innerText})
					}
				})
				questionList.push({"title":title,"type":2,"answer":choiceList})
			}
		}
	})

	if (questionList) {
		let formNameElement = document.querySelector('.freebirdFormviewerViewHeaderTitle')
		let formName = formNameElement ? formNameElement.innerText : ''
		
		console.log(questionList)
		console.log(formName)
		chrome.storage.sync.set({"formAnswers":{"formName":formName,"questionList":questionList}});
		
		chrome.runtime.sendMessage({"action":"showSavedForm"})
	}
}

function fillFormFromLocalStorage() {
	chrome.storage.sync.get("formAnswers", (formAnswers) => {
		let listContainer = document.querySelectorAll('.freebirdFormviewerViewNumberedItemContainer:not(.freebirdFormviewerViewItemsTextTextItem)')
		
		listContainer.forEach((container) => {
			
			let titleElement = container.querySelector('.freebirdFormviewerComponentsQuestionBaseTitle')
			
			if (titleElement) {
				let title = titleElement.innerText
			
				let question = formAnswers.formAnswers.questionList.filter(question => question.title == title)[0]
				if (question) {
					console.log(question)
					if (question.type == 1) {
						let choices = container.querySelectorAll('.docssharedWizToggleLabeledPrimaryText')
						choices.forEach((choice) => {
							
							console.log(choice.innerText)
							if (choice.innerText == question.answer) {
								
								choice.click()
							}
						})
					} else if (question.type == 2) {
						let choices = container.querySelectorAll('.docssharedWizToggleLabeledPrimaryText')
						choices.forEach((choice) => {
							
							console.log(choice.innerText)
							if (question.answer.some(item => item.choice == choice.innerText)) {
								if (!choice.parentNode.parentNode.parentNode.classList.contains('isChecked')) {
									choice.click()
								}
							} else {
								if (choice.parentNode.parentNode.parentNode.classList.contains('isChecked')) {
									choice.click()
								}
							}
						})
					}
				} 
			}
		})
		
		
	});
}

function getFormAnswersToFile() {
	let listContainer = document.querySelectorAll('.freebirdFormviewerViewItemsItemItem:not(.freebirdFormviewerViewItemsTextTextItem)')
	let questionList = []
	
	listContainer.forEach((container) => {
		let titleElement = container.querySelector('.freebirdFormviewerViewItemsItemItemTitle')
		
		if (titleElement) {
			let title = titleElement.innerText
			
			
			let answerElement = container.querySelector('label.docssharedWizToggleLabeledContainer.isChecked')
			if (answerElement) {
				let answer = answerElement.querySelector('.docssharedWizToggleLabeledPrimaryText').innerText
				questionList.push({"title":title,"answer":answer})
			}
			
		}
	})

	if (questionList) {
		var a = document.createElement("a");
		var file = new Blob({"formAnswers":{"formName":formName,"questionList":questionList}}, {type: 'text/plain'});
		a.href = URL.createObjectURL(file);
		a.download = 'FormFill.json';
		a.click();
	}
}

function fillFormFromFile() {
	// To do
	// let fileInput = document.createElement('input');
	// fileInput.type = 'file';
	// fileInput.accept = '.json';

	// fileInput.addEventListener('click', function(e) {
		// console.log('fileInput clicked');
	// }, false);
	
	// fileInput.addEventListener('change', function(e) {

	// }, false);

	// fileInput.click()
}


