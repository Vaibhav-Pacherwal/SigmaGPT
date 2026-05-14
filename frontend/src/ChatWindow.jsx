import "./ChatWindow.css";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { v1 as uuid1} from "uuid";
import BACKEND_URL from "./environment.js";

export default function ChatWindow({currThreadId, threadChats}) {
    let [prompt, setPrompt] = useState("");
    let [reply, setReply] = useState(null);
    let [loading, setLoading] = useState(false);
    let [prevChats, setPrevChats] = useState([]);
    let [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                threadId: currThreadId,
                message: prompt
            })
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/chat`, options);
            const res = await response.json();
            setReply(res.reply);
            console.log(res);

        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

        setPrompt("");
    }, [reply])

    useEffect(() => {
        console.log("thread changes", currThreadId);
        console.log(threadChats);

        setPrompt("");
        setReply(null);
        setPrevChats(threadChats || []);

    }, [currThreadId, threadChats]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <span className="userIcon" onClick={handleProfileClick}><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>
                        Setting
                    </div>
                    <div className="dropDownItem">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade Plan
                    </div>
                    <div className="dropDownItem">
                        <i className="fa fa-sign-out"></i>
                        Log Out
                    </div>
                </div>
            }

            <div className="chat">
                <Chat chats={prevChats} reply={reply}/>
            </div>

            <ScaleLoader color="#fff" loading={loading} />

            <div className="inputChat">
                <div className="userInput">
                    <input 
                      type="text" 
                      placeholder="Ask anything"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences. 
                </p>
            </div>
        </div>
    )
}