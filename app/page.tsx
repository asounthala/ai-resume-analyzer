"use client";

import { useState, useRef } from "react";

interface AnalysisResult {
	matchScore: number;
	summary: string;
	strengths: string[];
	gaps: string[];
	suggestions: string[];
}

export default function Home() {
	const [resume, setResume] = useState("");
	const [jobDescription, setJobDescription] = useState("");
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState("");
	const [fileName, setFileName] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		console.log("file type:", file.type, "file name:", file.name);

		setFileName(file.name);

		if (file.type === "text/plain") {
			const reader = new FileReader();
			reader.onload = (e) => setResume(e.target?.result as string);
			reader.readAsText(file);
		} else if (file.type === "application/pdf") {
			try {
				const formData = new FormData();
				formData.append("pdf", file);

				const response = await fetch("/api/parse-pdf", {
					method: "POST",
					body: formData,
				});

				console.log("response status:", response.status);
				const rawText = await response.text();
				console.log("raw response:", rawText);

				const data = JSON.parse(rawText);
				console.log("parsed data:", data);

				setResume(data.text);
			} catch (err) {
				console.error("Upload error:", err);
			}
		}
	};

	const analyze = async () => {
		setLoading(true);
		setError("");
		setResult(null);
		setProgress(0);

		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 99) {
					clearInterval(interval);
					return 99;
				}
				return Math.min(prev + Math.random() * 15, 99);
			});
		}, 400);

		try {
			const response = await fetch("/api/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ resume, jobDescription }),
			});

			if (!response.ok) throw new Error("Something went wrong");

			const data = await response.json();
			setResult(data);
		} catch (err) {
			setError("Failed to analyze. Please try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 75) return "text-green-400";
		if (score >= 50) return "text-yellow-400";
		return "text-red-400";
	};

	const getScoreBarColor = (score: number) => {
		if (score >= 75) return "bg-green-400";
		if (score >= 50) return "bg-yellow-400";
		return "bg-red-400";
	};
	return (
		<main className="min-h-screen bg-gray-950 text-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-10">
					<h1 className="text-4xl font-bold text-white mb-2">
						AI Resume Analyzer
					</h1>
					<p className="text-gray-400">
						Upload your resume. Paste the job description. Get instant feedback
						on how well you match and how to improve!
					</p>
				</div>

				{/* Input Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Your Resume
						</label>

						{/* File Upload Area */}
						<div
							onClick={() => fileInputRef.current?.click()}
							className="w-full h-64 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 mb-3"
						>
							<span className="text-gray-400 text-sm">
								{fileName ? `✓ ${fileName}` : "Click to upload PDF or TXT"}
							</span>
							{fileName && (
								<span className="text-gray-500 text-xs mt-1">
									Click to replace
								</span>
							)}
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf,.txt"
							onChange={handleFileUpload}
							className="hidden"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Job Description
						</label>
						<textarea
							className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
							placeholder="Paste the job description here..."
							value={jobDescription}
							onChange={(e) => setJobDescription(e.target.value)}
						/>
					</div>
				</div>

				{/* Analyze Button */}
				<button
					onClick={analyze}
					disabled={loading || !resume || !jobDescription}
					className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 mb-8"
				>
					{loading ? "Analyzing..." : "Analyze Resume"}
				</button>

				{/* Progress Bar */}
				{loading && (
					<div className="mb-8">
						<div className="flex justify-between text-xs text-gray-500 mb-1">
							<span>Analyzing with Claude...</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<div className="w-full bg-gray-800 rounded-full h-1.5">
							<div
								className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				)}

				{/* Error */}
				{error && (
					<div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-400">
						{error}
					</div>
				)}

				{/* Results */}
				{result && (
					<div className="space-y-6">
						{/* Score Card */}
						<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
							<h2 className="text-lg font-semibold text-gray-300 mb-4">
								Match Score
							</h2>
							<div className="flex items-end gap-4 mb-3">
								<span
									className={`text-6xl font-bold ${getScoreColor(result.matchScore)}`}
								>
									{result.matchScore}
								</span>
								<span className="text-gray-500 text-xl mb-2">/ 100</span>
							</div>
							<div className="w-full bg-gray-800 rounded-full h-2">
								<div
									className={`h-2 rounded-full transition-all duration-700 ${getScoreBarColor(result.matchScore)}`}
									style={{ width: `${result.matchScore}%` }}
								/>
							</div>
							<p className="text-gray-400 mt-4">{result.summary}</p>
						</div>

						{/* Strengths, Gaps, Suggestions */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
								<h2 className="text-lg font-semibold text-green-400 mb-4">
									✓ Strengths
								</h2>
								<ul className="space-y-2">
									{result.strengths.map((s, i) => (
										<li key={i} className="text-gray-300 text-sm">
											{s}
										</li>
									))}
								</ul>
							</div>

							<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
								<h2 className="text-lg font-semibold text-red-400 mb-4">
									✗ Gaps
								</h2>
								<ul className="space-y-2">
									{result.gaps.map((g, i) => (
										<li key={i} className="text-gray-300 text-sm">
											{g}
										</li>
									))}
								</ul>
							</div>

							<div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
								<h2 className="text-lg font-semibold text-blue-400 mb-4">
									→ Suggestions
								</h2>
								<ul className="space-y-2">
									{result.suggestions.map((s, i) => (
										<li key={i} className="text-gray-300 text-sm">
											{s}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
