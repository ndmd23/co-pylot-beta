# VSCODE Extension integrating OpenAI and GPT4All


https://user-images.githubusercontent.com/121035654/236586281-cbf1ca0a-e0bc-4572-b69a-e51bd6bac306.mp4


co-pylot-beta is a Visual Studio Code extension that allows you to integrate OpenAI models and APIs into your code. It creates a key-shortcut in VSCODE to connect to the stream of OpenAI's GPT-3.5-Turbo API and GPT4All for offline use.

Sidenote: Since GPT-3.5 and GPT-4 have a similar API, GPT-4 should work as well. Change ask_gpt.ask_turbo() the line `model="gpt-3.5-turbo"` to the model you want to call on. 

## Modes

- Script: Model responds in your script
- Editor: Opens Webview Editor to respond. Search bar: text to GPT-3.5 API

## Key-shortcuts

### General

- `ctrl+alt+m`: Changes between Modes
- `ctrl+alt+a`: Stops writing, "ends" API

### GPT-3.5-Turbo

- `ctrl+alt+g`: Selected text and history to GPT-3.5 API
- `ctrlalt+s`: Sets System prompt
- `ctrl+alt+v`: Shows history in Information Window
- `ctrl+alt+d`: Deletes history

### GPT4ALL

- `ctrl+alt+o`: Selected text to GPT4All

## Installation
**Basic**
Gives you only access to OpenAI.

1. Download co-pylot-beta-0.0.1.vsix
2. Install the package clients for vscode extension:
   - `npm install -g yo generator-code`
3. Run `code --install-extension C:/Users/path/to/co-pylot-beta/co-pylot-beta-0.0.1.vsix`.
4. Go to your the VSCODE Extensions Folder, which could look like `C:/Users/.vscode/extensions/undefined_publisher.co-pylot-beta-0.0.1`
   - open .env with a text editor, insert your OpenAI key. Create one [here](https://platform.openai.com/account/api-keys).



**Add GPT4All**

5. For offline use, download the model (4 GB) from [Github Nomic gpt4all](https://github.com/nomic-ai/gpt4all). Copy `gpt-lora-quantized.bin` and `gpt-lora-quantized-win64.exe` in a new empty `~/gpt4all` folder in `C:/Users/.vscode/extensions/undefined_publisher.co-pylot-beta-0.0.1`.


**Run it**
6. Check if it has been installed by going to  VSCode Extensions (`ctrl+shift+x`) and typing `@installed co-pylot-beta` in the search bar. You should find co-pylot by undefined_publisher.

7. Check functionality:
   - Press `ctrl+alt+m`: Split screen named AI Webview Editor should appear.
   OR
   - Press `ctrl+shift+p`, search for `HelloWorld`, and the Information Panel should show instantly.
    - Select text and press `ctrl+alt+g`. The response should be instant.
    - Select text and press `ctrl+alt+o`. The response appears within 30 seconds. If impatient, check taskmanager if `gpt-lora-quantized-win64.exe`is running
