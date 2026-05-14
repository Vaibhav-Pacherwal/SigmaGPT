import "./Chat.css";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"

export default function Chat({chats, reply}) {
    let [newChat, setNewChat] = useState(true);
    let [latestReply, setLatestReply] = useState("");

    useEffect(() => {
        if(!reply) {
            setLatestReply("");
            return;
        }

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(
                content.slice(0, idx+1).join(" ")
            );
            idx++;

            if(idx >= content.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval)

    }, [reply])

    useEffect(() => {
        if (reply === null && chats?.length === 0) {
            setNewChat(true);
        } else {
            setNewChat(false);
        }
    }, [reply, chats]);


    return (
        <>
          {newChat && <h1>Where should we begin?</h1>}
          <div className="chats">
             {
                (reply ? chats?.slice(0, -1) : chats).map((chat, idx) => {
                    return (
                        <div className={chat.role === 'user' ? 'userDiv' : 'gptDiv'} key={idx}>
                            {
                                chat.role === 'user' ?
                                <p className="userMessage">{chat.content}</p>:
                                <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                })
             }

             {
                chats?.length > 0 && latestReply !== null &&
                <div className="gptDiv" key={"typing"}>
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                </div>
             }
          </div>
        </>
    )
}