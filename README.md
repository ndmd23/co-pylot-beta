# VSCODE Extension integrating OpenAI and GPT4All

co-pylot is a Visual Studio Code extension that allows you to integrate OpenAI models and APIs into your code. It creates a key-shortcut in VSCODE to connect to the stream of OpenAI's GPT-3.5-Turbo API and GPT4All for offline use.

Sidenote: Since GPT-3.5 and GPT-4 have a similar API, GPT-4 should work as well. Change ask_gpt.ask_turbo() the line `model="gpt-3.5-turbo"` to the model you want to call on. 
For older models the API is different. Use ask_codex. instead.

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

To get this extension running, follow these steps:

1. Download the repository into the co-pylot folder.
2. Change the API-Key in the co-pylot/.env document. `OPEN_API_KEY = your_open_ai_key`. If you don't have one, create one [here](https://platform.openai.com/account/api-keys).
3. For offline use, download the model (4 GB) from [Github Nomic gpt4all](https://github.com/nomic-ai/gpt4all). Copy the chat folder `gpt-lora-quantized.bin` and `gpt-lora-quantized-win64.exe` in the empty `~/GPT4All` folder.

Check functionality 
   - open project folder in vscode
   - press `F5` to run extension in dev mode


4. Install the package clients for vscode extension:
   - `npm install -g yo generator-code`
5. ` install -g @vscode/vsce`
6. Open the co-pylot folder in vscode and run `vsce package`.
7. Install the extension in VSCode by running the `.vsix` file from the co-pylot folder in your node.js terminal: `code --install-extension C:/Users/path/to/co-pylot/co-pylot-0.0.1.vsix`.
7. Check if it has been installed by going to Extensions (`ctrl+shift+x`) and typing `@installed co-pylot` in the search bar. You should find co-pylot by undefined_publisher.
8. Check functionality:
   - Press `ctrl+alt+m`: Split screen named AI Webview Editor should appear.
   - OR
   - Press `ctrl+shift+p`, search for `HelloWorld`, and the Information Panel should show instantly.
    - Select text and press `ctrl+alt+g`. The response should be instant.
    - Select text and press `ctrl+alt+o`. The response appears within a few seconds.
