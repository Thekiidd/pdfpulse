import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudArrowUpIcon,
    SparklesIcon,
    PaperAirplaneIcon,
    DocumentTextIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const API_KEY = "AIzaSyBY5EDTVAAIuIEoE3mCNi4gMYTy9cQpYiE"; // User provided key

export default function AiPdfTool() {
    const [file, setFile] = useState(null);
    const [pdfText, setPdfText] = useState("");
    const [pdfImages, setPdfImages] = useState([]); // Store base64 images
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to convert PDF pages to images (base64)
    const pdfToImages = async (pdf) => {
        const images = [];
        // Limit to first 5 pages to avoid huge payloads for now
        const pagesToProcess = Math.min(pdf.numPages, 5);

        for (let i = 1; i <= pagesToProcess; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            // Get base64 string without the data:image/jpeg;base64, prefix for Gemini
            const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

            images.push({
                inlineData: {
                    data: base64,
                    mimeType: "image/jpeg",
                },
            });
        }
        return images;
    };

    const extractTextFromPdf = async (file) => {
        setIsExtracting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = "";

            // 1. Try to extract text first
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(" ");
                fullText += `Page ${i}: ${pageText}\n\n`;
            }

            setPdfText(fullText);

            // 2. If text is very short (likely an image PDF), generate images
            if (fullText.length < 100) {
                console.log("Text content is minimal. Converting pages to images for multimodal analysis...");
                const images = await pdfToImages(pdf);
                setPdfImages(images);
            } else {
                setPdfImages([]);
            }

            setMessages([{
                role: 'model',
                text: `¡Hola! He procesado tu PDF "${file.name}". ${fullText.length < 100 ? "(Parece ser un documento escaneado/imagen, así que lo analizaré visualmente)." : ""} ¿Qué te gustaría saber?`
            }]);
        } catch (error) {
            console.error("Error extracting text:", error);
            alert("Hubo un error al leer el PDF.");
            setFile(null);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            extractTextFromPdf(selectedFile);
        } else {
            alert("Por favor selecciona un archivo PDF válido.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            extractTextFromPdf(selectedFile);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || (!pdfText && pdfImages.length === 0)) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput("");
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            // Use gemini-1.5-flash which is fast and supports multimodal (images + text)
            // Or gemini-1.5-pro if higher quality is needed. 
            // Note: 'gemini-2.5-pro' likely doesn't exist publicly yet, reverting to a known working model.
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            let result;

            if (pdfImages.length > 0) {
                // Multimodal request: Text prompt + Images
                const prompt = `
          Analiza las siguientes imágenes que corresponden a las páginas de un documento PDF.
          Pregunta del usuario: ${userMessage}
          Responde basándote en el contenido visual de estas páginas.
          Usa formato Markdown para estructurar tu respuesta (listas, negritas, etc.) para que sea fácil de leer.
        `;
                result = await model.generateContent([prompt, ...pdfImages]);
            } else {
                // Text-only request
                const prompt = `
          Contexto del documento PDF:
          ${pdfText.substring(0, 30000)}
          
          Pregunta del usuario: ${userMessage}
          
          Responde de manera útil y concisa basada en el contexto.
          Usa formato Markdown para estructurar tu respuesta (listas, negritas, encabezados) para que sea fácil de leer.
          Nota: Si encuentras comentarios técnicos como "// Limit context...", ignóralos, son parte del sistema.
        `;
                result = await model.generateContent(prompt);
            }

            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'model', text: text }]);
        } catch (error) {
            console.error("Error calling Gemini:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Lo siento, hubo un error al procesar tu pregunta. (El modelo puede estar sobrecargado o el contenido es demasiado largo)." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setFile(null);
        setPdfText("");
        setPdfImages([]);
        setMessages([]);
        setInput("");
    };

    return (
        <div className="w-full h-full">
            {!file ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center hover:border-neon/50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <SparklesIcon className="w-12 h-12 text-neon" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Chat con tu PDF (IA)</h3>
                    <p className="text-gray-400 mb-8 text-lg">Arrastra tu documento aquí o haz clic para seleccionarlo</p>

                    <input
                        type="file"
                        id="pdf-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="pdf-upload"
                        className="btn-neon px-10 py-4 rounded-xl cursor-pointer inline-flex items-center gap-3 font-bold text-lg"
                    >
                        <CloudArrowUpIcon className="w-6 h-6" />
                        Seleccionar PDF
                    </label>
                </motion.div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Sidebar - File Info (Collapsible on mobile, fixed width on desktop) */}
                    <div className="lg:w-80 flex-shrink-0 bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <DocumentTextIcon className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-white truncate text-lg" title={file.name}>{file.name}</h3>
                                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <h4 className="text-xs font-bold text-neon mb-4 uppercase tracking-widest">Estado del Análisis</h4>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-3 text-sm text-gray-200 mb-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${isExtracting ? 'bg-yellow-400 animate-pulse' : 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'}`} />
                                    <span className="font-medium">{isExtracting ? 'Analizando...' : 'Listo para chatear'}</span>
                                </div>
                                {!isExtracting && (
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {pdfImages.length > 0
                                            ? "Modo Visual activo. La IA está 'viendo' las páginas de tu documento."
                                            : "Modo Texto activo. Contenido extraído y procesado correctamente."}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={clearChat}
                            className="mt-6 w-full py-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 font-medium group"
                        >
                            <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Cambiar archivo
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col overflow-hidden h-full relative">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                            {messages.length === 0 && !isExtracting && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                    <ChatBubbleLeftRightIcon className="w-20 h-20 mb-6" />
                                    <p className="text-lg font-medium">Empieza a chatear con tu documento</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] lg:max-w-[75%] p-5 rounded-2xl shadow-lg ${msg.role === 'user'
                                            ? 'bg-neon text-black font-medium rounded-tr-none'
                                            : 'bg-[#1a1a1a] border border-white/10 text-gray-200 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.role === 'model' ? (
                                            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:marker:text-neon">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#1a1a1a] border border-white/10 p-5 rounded-2xl rounded-tl-none flex gap-2 items-center shadow-lg">
                                        <span className="w-2 h-2 bg-neon rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-neon rounded-full animate-bounce delay-100" />
                                        <span className="w-2 h-2 bg-neon rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                            <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Pregunta algo sobre el PDF..."
                                    disabled={isLoading || isExtracting}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 focus:bg-white/10 transition-all disabled:opacity-50 shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || isExtracting || !input.trim()}
                                    className="absolute right-2 top-2 p-2.5 bg-neon rounded-lg text-black hover:bg-neon/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,0,51,0.4)]"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
