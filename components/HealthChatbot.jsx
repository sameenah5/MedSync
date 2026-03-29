"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";
import Link from "next/link";

export default function HealthChatbot() {

const [messages,setMessages]=useState([
{
from:"bot",
text:`👋 **MedSync AI Assistant**

Describe your symptoms to receive medical guidance.
You can also click on the symptom chips above for quick suggestions.`
}
]);

const [input,setInput]=useState("");
const [doctor,setDoctor]=useState(null);
const [emergency,setEmergency]=useState(false);
const [loading,setLoading]=useState(false);

const [weight,setWeight]=useState("");
const [height,setHeight]=useState("");
const [age,setAge]=useState("");

const messagesEndRef=useRef(null);

const symptomChips=[
"Fever",
"Headache",
"Cough",
"Stomach pain",
"Fatigue",
"Sore throat"
];

useEffect(()=>{
messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);



function startVoice(){

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
alert("Voice search not supported in this browser");
return;
}

const recognition=new SpeechRecognition();

recognition.lang="en-US";
recognition.start();

recognition.onresult=(event)=>{
const text=event.results[0][0].transcript;
setInput(text);
};

}



function formatResponse(text){

if(!text) return "";

let formatted=text;

formatted=formatted.replace(/##/g,"**");

return formatted;

}



async function handleSend(customText=null){

const text=customText || input;

if(!text.trim()) return;

setMessages(prev=>[...prev,{from:"user",text}]);

setInput("");

setLoading(true);

try{

const res=await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
message:text,
weight,
height,
age
})
});

const data=await res.json();

const formatted=formatResponse(data.message);

setMessages(prev=>[
...prev,
{from:"bot",text:formatted}
]);

setDoctor(data.doctor);
setEmergency(data.emergency);

}catch{

setMessages(prev=>[
...prev,
{from:"bot",text:"⚠️ Unable to generate medical response. Please try again."}
]);

}

setLoading(false);

}



return(

<div className="flex flex-col h-full rounded-xl border border-border bg-background">

{/* Symptom Chips */}

<div className="flex flex-wrap gap-2 p-3 border-b border-border">

{symptomChips.map((symptom,i)=>(
<button
key={i}
onClick={()=>handleSend(symptom)}
className="text-xs px-3 py-1 border border-border rounded-full hover:bg-muted"
>
{symptom}
</button>
))}

</div>



{/* Emergency Warning */}

{emergency &&

<div className="bg-red-500 text-white text-xs text-center p-2">
⚠️ Possible serious symptoms detected. Seek medical help immediately.
</div>

}



{/* Chat */}

<div className="flex-1 overflow-y-auto p-4 space-y-4">

{messages.map((msg,i)=>{

const isUser=msg.from==="user";

return(

<div key={i} className={isUser?"flex justify-end":"flex justify-start"}>

<div
className={
isUser
? "bg-emerald-600 text-white px-4 py-3 rounded-xl max-w-lg"
: "bg-muted border border-border px-4 py-3 rounded-xl max-w-lg"
}
>

<ReactMarkdown>
{msg.text}
</ReactMarkdown>

</div>

</div>

);

})}

{loading &&
<p className="text-xs text-muted-foreground">
AI analyzing symptoms...
</p>
}

<div ref={messagesEndRef}/>

</div>



{/* Doctor Card */}

{doctor &&

<div className="px-4 pb-3">

<div className="border border-border rounded-lg p-3 bg-card">

<p className="text-xs text-muted-foreground">
Recommended Specialist
</p>

<p className="text-sm font-semibold text-emerald-500 mb-2">
{doctor}
</p>

<Link
href="/doctors"
className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700"
>
Find Doctors
</Link>

</div>

</div>

}



{/* Health Inputs */}

<div className="px-4 pb-2">

<div className="flex gap-2">

<div className="flex flex-col w-1/3">
<label className="text-[10px] text-muted-foreground mb-1">
Weight (kg)
</label>
<input
type="number"
placeholder="65"
value={weight}
onChange={(e)=>setWeight(e.target.value)}
className="border border-border rounded-md p-2 text-xs bg-background"
/>
</div>


<div className="flex flex-col w-1/3">
<label className="text-[10px] text-muted-foreground mb-1">
Height (cm)
</label>
<input
type="number"
placeholder="170"
value={height}
onChange={(e)=>setHeight(e.target.value)}
className="border border-border rounded-md p-2 text-xs bg-background"
/>
</div>


<div className="flex flex-col w-1/3">
<label className="text-[10px] text-muted-foreground mb-1">
Age (years)
</label>
<input
type="number"
placeholder="25"
value={age}
onChange={(e)=>setAge(e.target.value)}
className="border border-border rounded-md p-2 text-xs bg-background"
/>
</div>

</div>

</div>



{/* Input */}

<div className="border-t border-border p-3 flex gap-2">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Describe your symptoms..."
className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background outline-none"
onKeyDown={(e)=>e.key==="Enter" && handleSend()}
/>

<button
onClick={startVoice}
className="px-3 bg-muted rounded-lg hover:bg-muted/80"
>
🎤
</button>

<button
onClick={()=>handleSend()}
className="bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700"
>
<Send size={16}/>
</button>

</div>

</div>

);

}