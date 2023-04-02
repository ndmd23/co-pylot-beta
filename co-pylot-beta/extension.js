//Modules
const vscode = require('vscode');
const {PythonShell}=require('python-shell');
const path = require('path');
const scriptDirectory = path.dirname(__filename);



//const provider = new MyWebviewViewProvider();




//Initial Global Variables
var inputs = [];
var totalWords = 0;
var stringList="";
var sys_prompt="-";
var default_prompt="prompt={You are a python software engineer. Create only python code and #comments, leave out instructions or explanations. No paragraph is allowed to contain 'as an AI language model'}";
inputs[0]=sys_prompt;
var editor_string="";
var variation="add_code";
const myEmitter = new vscode.EventEmitter();
var panel=null;
var text_string=null;
var counter=-1;


//Functions
function editor_html(editor_string){
	let mess_stringified=JSON.stringify(editor_string)
	mess_stringified=mess_stringified.replace(/\\n/g, "<br>")
	.replace(/\\t/g, "&emsp;")
	.replace(/\\r/g, "")
	.replace(/\\\\/g, "\\")
	.replace(/\\"/g, "&quot;")
	.replace(/\\b/g, "&#08;")
	.replace(/\\f/g, "&#12;")
	.replace(/\\v/g, '&#11;')
	.replace(/\\0/g, '')
	.replace(/\\x([0-9A-Fa-f]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))
	.replace(/\\u([0-9A-Fa-f]{4})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))
	.replace(/\\'/g, "&#039;");
	panel.webview.html = `
	<!DOCTYPE html>
	<html>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, hight= device-hight, initial-scale=1.0"
	<head>	</head>
	<style>
	#searchInput{
		display: flex;
	   	position: fixed;
	   	bottom: 0;
	   	left: 0;
	   	width: 100%;
	   	padding: 10px;
	   	background-color: #000;
	   	color: #c2c2c2;
	}
	.code-container {
		position: relative;
	  }
	  
	.code-editor {
		border: 2px solid #000;
		border-radius: 4px;
		padding: 10px;
		font-family: monospace;
	}
	  
	.copy-button {
		position: absolute;
		top: 5px;
		right: 5px;
		padding: 5px;
		background-color: #ccc;
		border-radius: 4px;
		cursor: pointer;
	}
	body {
	padding-bottom: 50px;
	}
	#myDiv{
		    height: 100%;
    overflow-y: scroll;
	}
   </style>
	<script>
	   function addMessage() {
		   const myDiv = document.getElementById('myDiv');
		   const html = ${mess_stringified};
		   const newElement = document.createElement('div');
		   newElement.innerHTML = html;
		   myDiv.appendChild(newElement);
	   };

	</script>
	<body onload="addMessage()">
		<div id="myDiv" onload="addMessage()"></div>
		<div class="search-bar">
			<input id="searchInput" type="text" placeholder="Search...">
		</div>

	</body>
	<script>
		const vscode = acquireVsCodeApi();
		const searchInput = document.getElementById('searchInput');
		searchInput.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') { 
				const searchTerm = searchInput.value;
				vscode.postMessage({ type: 'updateHtml', value: searchTerm });
				searchInput.value='';
			}
		});
		const copyButton = document.getElementById('.copy-button');

		copyButton.addEventListener('click',()=>{
			var codeEditor = document.querySelector('.code-editor');
			var range = document.createRange();
			range.selectNode(codeEditor);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();

		})
		function copyCode() {
			var codeEditor = document.querySelector('.code-editor');
			var range = document.createRange();
			range.selectNode(codeEditor);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		// Scroll message list to bottom
		function scrollDown() {
			var chatbox = document.querySelector("myDiv")
			chatbox.scrollTo(0, chatbox.scrollHeight);
			}
		  }
	</script>
	</html>
	`;
};

//Main function:
function pyshell_editor(filepath, model, variation){
	vscode.window.showInformationMessage("Welcome to "+model+"!");

	var list=[];
	var terminate=false;
	var onlyonce=true;

	if (["add_code", "editor"].includes(variation)) {	//Selected Text and Position
	var activeEditor = vscode.window.activeTextEditor;
	var text_selection = activeEditor.selection;
	text_string = activeEditor.document.getText(text_selection);
	var text_position = text_selection.end.translate(1,0);
	}else{
		text_string=variation;
	}
	//Search in editor changes variation as holder of text_string
	if (["add_code"].includes(variation)===false){
		//Editor Mode: Add text to string.
		editor_string=editor_string+"\\n<div><h3>"+text_string+"</h3></div>\\n";
		editor_html(editor_string)
	};	

	//Stop if empty 
	if (text_string==""){
		vscode.window.showInformationMessage("No String, no entry. Please try another Airline. \r\nNo, you can't speak to the pilot. I know I am not your boss, but... Aaahhh! If had it. SECURITY!? Escort this person off the place, please.")
		return;
	}

	//GPT: Add System Prompt
	sys_send(sys_prompt); //adds current sys_prompt as inputs[0]
	//Add to saved Input
	saveInput(text_string);
	//GPT accepts multiple Inputs
	if (model=="GPT"){
		text_string=inputs.join("¬")
			};
	
	function add_code(activeEditor, message){
		activeEditor.edit((edit => {
			edit.insert(text_position, message);
			if (text_position.character>120){
				edit.insert(text_position, '\n');
			}
			}));
		};

	//Setup Python Call
	let options={
		pythonPath: path.join(scriptDirectory, '.venv/Scripts/python'),
		pythonOptions: ['-u'],
	};
	var pyshell_c = new PythonShell(filepath, options);

	//Send Input
	pyshell_c.send(text_string);
	
	//Connect line
	pyshell_c.on('message', function (message) {
		//Termination Triggered with ctrl+alt+a
		if (terminate) {
			if (onlyonce){
				//Collect List of messages, concat string
				var result="";
				for (let i = 0; i < list.length; i++) {
				  result = result.concat(list[i].toString());
				};
				saveInput(result)
				onlyonce=false;
			}
			return;
		  }
		//Parse and save answers
		message=JSON.parse(message);
		list.push(message);

		if (variation=="add_code"){
			//Count escape symbols affecting position
			message=message.replace(/\t/g, "    ");
			const numNewlines = (message.match(/\n/g) || []).length;
			if(model=="GPT4All"){
				message=remove_ansi(message)
				console.log(message)
			}
			add_code(activeEditor, message)
			//Set new position
			text_position=text_position.translate(numNewlines, message.length);
			if (text_position.character>120){
					text_position = new vscode.Position(text_position.line + 1, 0)
			};
		}else{
			if (message.includes("``")){
				counter=counter*(-1);
				if (counter==1){
					message=  '<div class="code-container"><pre class="code-editor">';
				}else{
				message= '</pre><button class="copy-button" onclick="copyCode()">Copy</button></div>';
				}
			}
			if(model=="GPT4All"){
				message=ansi_html(message)
			}
			editor_string= editor_string + message;
			editor_html(editor_string);
		}
	});
	//End Trigger to Abort pyshell
	myEmitter.event(() => {
		terminate=true;
		pyshell_c.send('terminate');
		pyshell_c.end(function (err) {
			if (err) {
			  console.error(err);
			} else {
			  console.log('Communication channel closed.');
			}
		  });
		terminate=true;
	  });
	//End
	pyshell_c.end((err)=> {
		if (err){
			const errorMessage = err.toString();
			activeEditor.edit((selectedText) => {
				selectedText.replace(text_selection, text_string+"\n"+errorMessage);
			});
		};
		//Collect List of messages, concat string
		if (terminate==false){
				var result="";
				for (let i = 0; i < list.length; i++) {
				  result = result.concat(list[i].toString());
				};
			saveInput(result)
		};
		//For GPT, count words
		if(model=="GPT"){
			totalWords=wordCount();
			vscode.window.showInformationMessage("Tokens used: "+totalWords);
			if (totalWords>2000){
				vscode.window.showInformationMessage("Tokenlimit reached. Prompt will delete oldest Input in memory.")
				inputs.splice(1, 2);
			}
		};
	});
};

function ansi_html(text) {
	// Define the ANSI escape sequence patterns and their corresponding HTML tags
	const patterns = [
	  { pattern: /\u001b\[0m/g, tag: '</span>' },
	  { pattern: /\u001b\[30m/g, tag: '<span style="color:black;">' },
	  { pattern: /\u001b\[31m/g, tag: '<span style="color:red;">' },
	  { pattern: /\u001b\[32m/g, tag: '<span style="color:green;">' },
	  { pattern: /\u001b\[33m/g, tag: '<span style="color:yellow;">' },
	  { pattern: /\u001b\[34m/g, tag: '<span style="color:blue;">' },
	  { pattern: /\u001b\[35m/g, tag: '<span style="color:magenta;">' },
	  { pattern: /\u001b\[36m/g, tag: '<span style="color:cyan;">' },
	  { pattern: /\u001b\[37m/g, tag: '<span style="color:white;">' },
	  { pattern: /\u001b\[1m/g, tag: '<b>' },
	  { pattern: /\u001b\[4m/g, tag: '<u>' }
	];
  
	// Replace each ANSI escape sequence with its corresponding HTML tag
	patterns.forEach(({ pattern, tag }) => {
	  text = text.replace(pattern, tag);
	});
  
	return text;
  }

  function remove_ansi(text) {
	// Create a regular expression to match ANSI escape characters
	const ansiEscapeRegex = /[\u001b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	
	// Use the replace() method with the regular expression to remove all matches
	const cleanedText = text.replace(ansiEscapeRegex, '');
  
	return cleanedText;
  }

//Sets Correct Systemmprompt
function sys_send(text_string){
	if (text_string.length===0){ 
		//Empty entry -> default_prompt
		if (inputs[0]==sys_prompt){
			sys_prompt=default_prompt;
			inputs[0]=sys_prompt;
		}else{//Case Codex to GPT
			sys_prompt=default_prompt;
			inputs.unshift(sys_prompt);
			console.log("sys_prompt:2"+sys_prompt)
		};
	};
	if(sys_prompt!=text_string){
		//Case: GPT
		//If there was already a system prompt, replace it
		if (inputs[0]==sys_prompt){
			sys_prompt=text_string;
			inputs.splice(0,1);
			inputs.unshift(sys_prompt);
		}
		else{//Case: Codex
		sys_prompt=text_string;
		inputs.unshift(sys_prompt);
		};
	};
	vscode.window.showInformationMessage("New System Prompt: "+sys_prompt)
};

//Save the prompt and response
function saveInput(string_selected) {
	if (string_selected) {
		inputs.push(string_selected);
	  }
};
//Count tokens
function wordCount(){
	stringList=JSON.stringify(inputs);
	totalWords=0;
	for (let i = 0; i < stringList.length; i++) {
	  // Split the string into an array of words
	  const words = stringList[i].split("\bword\b");
	  // Add the number of words in the array to the total
	  totalWords += words.length;
	};
	return totalWords
};

//Commands
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('co-pylot-beta.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from co-pylot-beta!');
	});


	//Set Sys Prompt: ctrl+alt+s
	let sys_disp=vscode.commands.registerCommand('co-pylot.SetSysprompt', function(){
		//Selected Text
		var activeEditor = vscode.window.activeTextEditor;
		var text_selection = activeEditor.selection;
		var text_string = activeEditor.document.getText(text_selection);
		if (text_string.length === 0){
			text_string = default_prompt;
		}
		sys_send(text_string);
	});

	//Retrieve all Input: ctrl+alt+v
  	let retrieve_input=vscode.commands.registerCommand('co-pylot.retrieveInput', () => {
	  	const saved_list = JSON.stringify(inputs);
		const saved_string=saved_list.toString();
	  	if (saved_string && saved_string!='[]') {
	  	  vscode.window.showInformationMessage(saved_string);
	  	} else {
	  	  vscode.window.showInformationMessage('No input saved');
	  	}
	});
	//Delete History: ctrl+alt+d
	let clear_input=vscode.commands.registerCommand('co-pylot.clearInput', ()=>{
		if (inputs){
			inputs=[inputs[0]];
			vscode.window.showInformationMessage('Conversation Cleared. Current system prompt: '+sys_prompt);
		}
	});
	//Connect to GPT: ctrl+alt+g
	let disp_gpt = vscode.commands.registerCommand('co-pylot.SelectGpt', function(){
		const filepath = path.join(scriptDirectory, 'ask_gpt.py');
		pyshell_editor(filepath, "GPT",variation)
	});
	//Connect to Codex: ctrl+alt+c
	let disp_codex=vscode.commands.registerCommand('co-pylot.SelectCodex', function(){
		const filepath = path.join(scriptDirectory, 'ask_codex.py');
		pyshell_editor(filepath, "Codex",variation);
		});
	//Test to connect to different LLM: ctrl+alt+r
	let gpt_all=vscode.commands.registerCommand('co-pylot.gpt_all', ()=>{
		const filepath = path.join(scriptDirectory, 'gpt4all.py');
		pyshell_editor(filepath, "GPT4All",variation);
		});
	
	//Change to/from Editor Mode: ctrl+alt+M
	let change_mode=vscode.commands.registerCommand('co-pylot.EditorMode', ()=>{
		if (variation=="add_code"){
			editor_string="";
			variation="editor";
			default_prompt="Send each of your messages after this as if it were to be put in html code. you can change the styles and fonts using html syntax. example: <p style='font-family:courier;'>text</p>.'\\n' should be <br>"
			
			panel = vscode.window.createWebviewPanel(
				'myEditor', // Identifies the type of the webview. Used internally
				'AI Webview Editor', // Title of the panel displayed to the user
				vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [vscode.Uri.file(context.extensionPath)],
				}
			 );
			//Listener for User Input
			panel.webview.onDidReceiveMessage(message => {
				if (message.type === 'updateHtml') {
					vscode.window.showInformationMessage(message.value);
					const filepath = path.join(scriptDirectory, 'ask_gpt.py');
					pyshell_editor(filepath, "GPT", message.value)
				}
				if(message.type==='copyCode'){
					//let range=message.range
					//window.getSelection().removeAllRanges();
					//window.getSelection().addRange(range);
					//document.execCommand('copy');
					//window.getSelection().removeAllRanges();
					
				}
			});
			panel.onDidDispose(() => {
				variation=="add_code";
				vscode.window.showInformationMessage("Change Mode to: "+variation);

			});
			//Default Webview
			editor_html("");
		//Switch back from Webview
		}else if(variation=="editor"){
			panel.dispose();
			variation="add_code";
			editor_string="";
			inputs=[inputs[0]];			
		};
		vscode.window.showInformationMessage("Change Mode to: "+variation);
		//Eventlistener if panel is closed!
	});
	//Emitters
	let abort_disp=	vscode.commands.registerCommand('co-pylot.AbortFunction',function(){
		//vscode.window.showInformationMessage('Abort Mission, returning to runway.')
		myEmitter.fire();
		});

	context.subscriptions.push(disposable, retrieve_input, clear_input, disp_gpt, disp_codex, gpt_all, sys_disp, change_mode, abort_disp);


};

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
