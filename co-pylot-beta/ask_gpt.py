import sys, json
import openai
import os
import asyncio
import time




#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #lines="I called you a thousand times!"
    # Since our input would only be having one line, parse our JSON data from that
    return lines


def ai_key():
    full_path = os.path.realpath(__file__)
    parent_path=os.path.dirname(full_path)
    parent_path=parent_path.replace('\\', '/')
    with open(parent_path+'/.env', 'r') as f:
        api_key = f.read()
    return api_key.split('=')[1]


async def ask_turbo():
    #Get Authentication Key: https://platform.openai.com/account/api-keys
    AI_Authentication_Key=ai_key()
    openai.api_key = AI_Authentication_Key
    prompt_list=await handle_std()
    #Chose model
    model="gpt-3.5-turbo"
    
    #Get request https://api.openai.com/v1/chat/completions
    response=openai.ChatCompletion.create(
    model=model,
    max_tokens=2000,
    temperature=0,
    messages=prompt_list,
    stream=True
    ) 
    #Code for stream=False
    #answer = response.choices[0].message
    #print(json.dumps(answer))
    
    for chunks in response:
       delta=chunks.choices[0].delta
       #Check if deltas.content exists. If it does, print it
       if 'content' in delta:
           content = delta['content']
           print(json.dumps(content))
           time.sleep(0.15)



async def handle_std():
    prompt=[]
    input= sys.stdin.readlines()
    input_list=str(input).split('¬')
    for i, line in enumerate(input_list):
        if i==0:
            role="system"
        elif i % 2==0:
            role="user"
        else:
            role="assistant"
        dict={"role": role, "content": line.strip()}
        prompt.append(dict)
    return prompt


#Test function
def turbo_adapter():
    prompt=handle_std()
    #Testrun
    #prompt=turbo_format("Hi there?")
    answer=ask_turbo(prompt)
    answer=answer['content']
    answer=json.dumps(answer)
    print(answer)


 #Start process
if __name__ == '__main__':
    asyncio.run(ask_turbo())





