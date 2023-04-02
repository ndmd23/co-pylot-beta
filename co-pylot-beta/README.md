
VSCODE Extension for Integration of OpenAI Models and APIs

Creates key-shortcut in VSCODE to connect to STREAM of
    - OpenAI        GPT-3.5-Turbo API       API-Key required
                    text-davinci-3
    - GPT4All       for Offline Use.        download of 4GB model required

Modes  
    - Script        model responds in your script
    - Editor        opens Webview Editor to respond
                    Search bar: text to GPT-3.5 API

Key-shortcuts
    General
        ctrl+alt+m      Changes between Modes
        ctrl+alt+a      stops writing, "ends" API
    GPT-3.5-Turbo
        ctrl+alt+g      selected text and history to GPT-3.5 API
        ctrl+alt+s      sets System prompt
        ctrl+alt+v      shows history in Information Window
        ctrl+alt+d      deletes history
    GPT4ALL
        ctrl+alt+o      offline selected text to gpt4all


To get this extension running follow these steps:

Download Repository
    Into co-pylot folder

API-KEY

    Change API-Key in co-pylot/.env document
    OPEN_API_KEY = your_open_ai_key

    If you don't have one, create one here:
        https://platform.openai.com/account/api-keys

Offline Use

    Currently uses gpt-lora-quantized.bin and gpt-lora-quantized-win64.exe
    It calls .exe with a python subprocess. This slows it down somewhat. 
    If a better solution is released, write me up. Ill try to implement it

    To get this started go here to download the model (4 GB)
    
    - Download from Github Nomic gpt4all in different folder
        https://github.com/nomic-ai/gpt4all
    
    - Copy chat folder gpt-lora-quantized.bin and gpt-lora-quantized-win64.exe in the empty ~/GPT4All folder 
 
Create .vsix file

    - install package clients for vscode extention
        npm install -g yo generator-code
        npm install -g @vscode/vsce
    - open co-pylot folder in vscode    
        vsce package


Install Extension in VSCode

    Run vscix file from co-pylot folder in your node.js terminal:

        code --install-extension C:/Users/path/to/your-extension/your-extension-0.0.1.vsix

Check if it has been installed

- go to Extensions (ctrl+shift+x)
- type '@installed co-pylot' in search bar

You should find co-pylot by undefined_publisher.

Check functionality

General
    - Press ctrl+alt+m: split screen named AI Webview Editor should appear
    OR
    - Press ctrl+shift+p
    - search >'HelloWorld'
    - Information Panel shows instantly
ChatGPT
    - Select Text
    - Press ctrl+alt+g
        Response should be Instant
GPT4All
    - Select Text
    - Press ctrl+alt+o
        Response appears within ca 30 seconds, be patient
    
