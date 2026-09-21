import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Send, ShieldAlert, User, Sparkles } from "lucide-react";
import { createConversation, sendAIMessage } from "../../services/aiService";

const SUGGESTIONS = [
	"I've had a headache for two days",
	"I'm feeling really stressed lately",
	"I have trouble sleeping",
	"I have a mild fever since yesterday",
];

const AIAssistant = () => {
	const [conversationId, setConversationId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [requiresDoctor, setRequiresDoctor] = useState(false);
	const bottomRef = useRef(null);

	useEffect(() => {
		const startChat = async () => {
			try {
				const data = await createConversation();
				setConversationId(data.conversation._id);
			} catch (error) {
				console.error(error);
			}
		};

		startChat();
	}, []);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	const sendMessage = async (text) => {
		if (!text.trim() || !conversationId || loading) return;

		const userMessage = text.trim();
		setMessages((previous) => [
			...previous,
			{ role: "user", content: userMessage },
		]);
		setInput("");
		setLoading(true);

		try {
			const data = await sendAIMessage(conversationId, userMessage);
			setMessages((previous) => [
				...previous,
				{ role: "assistant", content: data.response },
			]);
			setRequiresDoctor(data.requiresDoctor);
		} catch {
			setMessages((previous) => [
				...previous,
				{
					role: "assistant",
					content: "Sorry, I was unable to process your message.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	const handleSend = (e) => {
		e.preventDefault();
		sendMessage(input);
	};

	return (
		<div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
			<div className="mb-4">
				<h1 className="page-title flex items-center gap-2">
					<Bot size={26} className="text-peach-600" /> AI Health
					Assistant
				</h1>
				<p className="page-subtitle">
					Ask questions about your health and get general educational
					guidance.
				</p>
			</div>

			<div className="card flex flex-1 flex-col overflow-hidden">
				<div className="flex-1 space-y-4 overflow-y-auto p-5">
					{messages.length === 0 && (
						<div className="flex h-full flex-col items-center justify-center gap-4 text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-peach-50 text-peach-700 border border-peach-100">
								<Sparkles size={22} />
							</div>
							<p className="max-w-sm text-sm text-ink-500">
								Tell me what's going on, and I'll help you
								organize your concern and figure out next steps.
							</p>
							<div className="flex flex-wrap justify-center gap-2">
								{SUGGESTIONS.map((s) => (
									<button
										key={s}
										onClick={() => sendMessage(s)}
										className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-peach-50/50 hover:border-peach-200 transition"
									>
										{s}
									</button>
								))}
							</div>
						</div>
					)}

					{messages.map((message, index) => (
						<div
							key={index}
							className={`flex gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}
						>
							<div
								className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
									message.role === "user"
										? "bg-ink-800 text-white"
										: "bg-peach-100 text-peach-700"
								}`}
							>
								{message.role === "user" ? (
									<User size={15} />
								) : (
									<Bot size={15} />
								)}
							</div>
							<div
								className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
									message.role === "user"
										? "rounded-tr-sm bg-ink-900 text-white"
										: "rounded-tl-sm bg-ink-100 text-ink-800"
								}`}
							>
								{message.content}
							</div>
						</div>
					))}

					{loading && (
						<div className="flex items-center gap-2.5">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-700">
								<Bot size={15} />
							</div>
							<div className="flex gap-1 rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-3">
								<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-peach-400 [animation-delay:-0.3s]" />
								<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-peach-400 [animation-delay:-0.15s]" />
								<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-peach-400" />
							</div>
						</div>
					)}
					<div ref={bottomRef} />
				</div>

				{requiresDoctor && (
					<div className="mx-5 mb-3 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
						<ShieldAlert
							size={18}
							className="mt-0.5 shrink-0 text-amber-600"
						/>
						<div className="flex-1">
							<p className="text-sm font-bold text-amber-800">
								Professional consultation recommended
							</p>
							<p className="mt-0.5 text-xs text-amber-700">
								Based on what you described, consider speaking
								with a healthcare professional.
							</p>
						</div>
						<Link
							to="/patient/appointments"
							className="btn-sm shrink-0 bg-amber-600 text-white hover:bg-amber-700"
						>
							Find a doctor
						</Link>
					</div>
				)}

				<form
					onSubmit={handleSend}
					className="flex items-center gap-2 border-t border-ink-100 p-4"
				>
					<input
						className="input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Describe your health concern..."
					/>
					<button
						type="submit"
						className="btn-primary shrink-0"
						disabled={loading || !conversationId}
					>
						<Send size={16} />
					</button>
				</form>
			</div>

			<p className="mt-3 text-center text-xs text-ink-400">
				This assistant provides general educational information and is
				not a substitute for professional medical advice or diagnosis.
			</p>
		</div>
	);
};

export default AIAssistant;
