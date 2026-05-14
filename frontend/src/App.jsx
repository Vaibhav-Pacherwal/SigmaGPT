import { useState, useEffect } from 'react';
import './App.css'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar';
import { v1 as uuid1} from "uuid";

function App() {
  let [threadId, setThreadId] = useState(uuid1());
  let [allThreads, setAllThreads] = useState([]);
  let [threadChats, setThreadChats] = useState([]);

    const getAllThreads = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/thread");
        const res = await response.json();
        const filteredResponse = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
        setAllThreads(filteredResponse);

      } catch(err) {
        console.log(err);
      }
    }

    useEffect(() => {
      getAllThreads();
    }, []);

    const createNewThread = () => {
      setThreadId(uuid1());
      setThreadChats([]);
      getAllThreads();
    }

    const changeThread = async (thread_id) => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/thread/${thread_id}`);
        const res = await response.json();
        setThreadChats(res);
        setThreadId(thread_id);
        getAllThreads();

      } catch(err) {
        console.log(err);
      }
    }

    const deleteThread = async (thread_id) => {
      try {
          await fetch(
              `http://localhost:3000/api/v1/thread/${thread_id}`,
              {
                  method: "DELETE"
              }
          );

          setAllThreads(prev =>
              prev.filter(
                  thread => thread.threadId !== thread_id
              )
          );

          if (threadId === thread_id) {
              createNewThread();
          }

      } catch(err) {
          console.log(err);
      }
  }

  return (
    <div className='app'>
      <Sidebar currThreadId={threadId} deleteThread={deleteThread} threads={allThreads} createNewThread={createNewThread} changeThread={changeThread}/>
      <ChatWindow threadChats={threadChats} currThreadId={threadId}/>
    </div>
  )
}

export default App
