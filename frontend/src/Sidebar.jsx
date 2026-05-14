import { useEffect, useState } from "react";
import blacklogo from "./assets/blacklogo.png";
import "./Sidebar.css";

export default function Sidebar({currThreadId, threads, createNewThread, changeThread, deleteThread}) {
    return (
        <section className="sidebar">
          <button onClick={createNewThread}>
            <img src={blacklogo} className="logo" alt="gpt-logo" />
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <div className="history">
            {
              threads?.map((thread, idx) => (
                <li key={idx} onClick={(e) => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted" : " "}>
                  {thread.title}
                  <i className="fa-solid fa-trash" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }} 
                  title="Remove this thread"></i>
                </li>
              ))
            }
          </div>

          <div className="sign">
            By Vaibhav Pacherwal
          </div>
        </section>
    )
}