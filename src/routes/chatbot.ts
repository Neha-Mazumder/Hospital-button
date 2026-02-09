import { Router } from "express";

const router = Router();

// Ollama API endpoint (default: http://localhost:11434)
const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "tinyllama"; // Using TinyLlama model (small & fast)

// System prompt to make the AI act as a hospital assistant (SHORTER for speed)
const SYSTEM_PROMPT = `You are a Hospital Assistant. When user describes symptoms, suggest the right doctor department in 1-2 sentences.
Departments: Cardiology (heart), Neurology (brain/headache), Orthopedics (bones), Dermatology (skin), Pediatrics (children), ENT (ear/nose/throat), Gynecology (women), Dental (teeth), Gastroenterology (stomach), General Medicine (fever/general).
Be brief and friendly. Use emojis. Always recommend booking an appointment.`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Store conversation history per session (in production, use Redis or database)
const conversationHistory: Map<string, ChatMessage[]> = new Map();

router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get or create conversation history
    let history = conversationHistory.get(sessionId) || [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Add user message to history
    history.push({ role: "user", content: message });

    // Keep only last 10 messages to avoid context overflow
    if (history.length > 12) {
      history = [history[0], ...history.slice(-10)];
    }

    console.log(`[Ollama] Sending message: "${message.substring(0, 50)}..."`);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 8 second timeout

    // Call Ollama API
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: history,
        stream: false,
        options: {
          temperature: 0.9,
          top_p: 0.8,
          num_predict: 100, // Shorter responses = faster
          num_ctx: 512,     // Smaller context window = faster
          repeat_penalty: 1.1
        }
      })
    });

    clearTimeout(timeout); // Clear timeout on success

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Ollama] Error:", errorText);
      
      // Check if Ollama is not running
      if (response.status === 404 || errorText.includes("not found")) {
        return res.status(503).json({ 
          error: "Model not found. Please run: ollama pull llama3.2",
          fallback: true
        });
      }
      
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    // Add assistant response to history
    history.push({ role: "assistant", content: assistantMessage });
    conversationHistory.set(sessionId, history);

    console.log(`[Ollama] Response: "${assistantMessage.substring(0, 50)}..."`);

    res.json({ 
      response: assistantMessage,
      model: MODEL_NAME
    });

  } catch (error: any) {
    console.error("[Ollama] Error:", error.message);
    
    // Check if timeout (aborted)
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: "AI response took too long. Using quick response.",
        fallback: true
      });
    }
    
    // Check if Ollama is not running
    if (error.cause?.code === "ECONNREFUSED") {
      return res.status(503).json({ 
        error: "Ollama is not running. Please start Ollama first.",
        fallback: true
      });
    }

    res.status(500).json({ 
      error: "Failed to get AI response",
      fallback: true
    });
  }
});

// Clear conversation history
router.post("/clear", (req, res) => {
  const { sessionId = "default" } = req.body;
  conversationHistory.delete(sessionId);
  res.json({ success: true, message: "Conversation cleared" });
});

// Health check for Ollama
router.get("/status", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map((m: any) => m.name) || [];
      res.json({ 
        status: "online", 
        models,
        hasLlama: models.some((m: string) => m.includes("llama") || m.includes("qwen") || m.includes("tiny"))
      });
    } else {
      res.json({ status: "offline" });
    }
  } catch {
    res.json({ status: "offline" });
  }
});

export default router;
