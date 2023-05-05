import asyncio
import signal
import json
import sys
import os
import platform

script_dir = os.path.abspath(__file__)
parent_dir = os.path.dirname(script_dir)
op_sys = platform.system()


## Change this to the path of your executable file
exe_dir = os.path.join(parent_dir+"/gpt4all/")
if op_sys == "Windows":
    exe_path = os.path.join(exe_dir+"/gpt4all-lora-quantized-win64.exe")
if op_sys == "Linux":
    exe_path = os.path.join(exe_dir+"/gpt4all-lora-quantized-linux-x86")
if op_sys == "Darwin":
    exe_path = os.path.join(exe_dir+"/gpt4all-lora-quantized-OSX-intel")

process = None
gt_count=0

async def read_async():
    loop = asyncio.get_event_loop()
    line = await loop.run_in_executor(None, sys.stdin.readline)
    line = line.strip()
    if not line:
        return "terminate"
    return line

async def read_output(stream):
    global process
    global gt_count
    while True:
        try:
            output_line = await asyncio.wait_for(stream.readuntil(separator=b" "), timeout=30)
            if not output_line:
                break
            output_line=output_line.decode("utf-8")
            output_line=json.dumps(output_line)
            if "\\r\\n>" in output_line:
                gt_count += 1
                output_line=output_line.replace("\\r\\n>", "\\r\\n")
                print(output_line)
                if gt_count >=2:
                    break
            else:
                print(output_line)
            
        except asyncio.TimeoutError:
            print("Output timeout")
            break


async def run_loop():
    process = await asyncio.create_subprocess_exec(exe_path,
                                       stdin=asyncio.subprocess.PIPE,
                                       stdout=asyncio.subprocess.PIPE,
                                       stderr=asyncio.subprocess.PIPE,
                                       cwd=exe_dir)
    while True:
        try:
            prompt=await read_async()
            #prompt = input("\u001b[32m>")
            #print("\u001b[0m")
            if prompt in {"terminate", "", "\n", None}:
                if process.returncode is None:  # check if process is running
                    process.send_signal(signal.SIGTERM)
                    await process.wait()
                break
            await run_command(prompt, process)
        except:
            process.send_signal(signal.SIGTERM)
            await process.wait()
            break

async def run_command(prompt, process):
    output_task = None  
    input_bytes = prompt.encode("utf-8")
    process.stdin.write(input_bytes)
    process.stdin.write(b"\r\n")
    await process.stdin.drain()
    await read_output(process.stdout)


if __name__ == "__main__":
        asyncio.run(run_loop())
        
