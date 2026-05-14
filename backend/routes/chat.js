import express from "express";
import Thread from "../models/Thread.js";
import getGroqResponse from "../utils/groq.js";

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing new thread"
        });

        const response = await thread.save();
        res.send(response);

    } catch(err) {
        console.log(err);
    }
});

router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});
        res.status(200).json(threads);

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json(thread.messages);

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            res.status(404).json({ error: "Thread could not be deleted" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete the thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if(!threadId || !message) {
        res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let thread = await Thread.findOne({threadId});
        if(!thread) {
            thread = await Thread.create({
                threadId: threadId,
                title: message,
                messages: [{ role:"user", content:message}],
            });

        } else {
            thread.messages.push({role:"user", content:message});
        }

        const assistantReply = await getGroqResponse(message);
        thread.messages.push({role:"assistant", content:assistantReply});
        thread.updatedAt = new Date();

        await thread.save();

        res.status(200).json({ reply: assistantReply });

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong"});
    }
});

export default router;