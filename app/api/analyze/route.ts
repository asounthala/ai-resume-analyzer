import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
        return NextResponse.json(
            { error: "Both resume and job description are required." },
            { status: 400 }
        );
    }

    const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: `You are an expert resume coach and hiring consultant. Analyze the following resume against the job description and return ONLY a JSON object with no markdown formatting or code blocks. Be friendly and concise, but provide specific feedback. The JSON must have the following structure:

    The JSON must follow this exact structure:
    {
    "matchScore": <number 0-100>,
    "summary": "<2-3 sentence overall assessment>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
    "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
    "keywords": "<an array containing the most important keywords that are in the job description but missing from the resume>"
    }

    JOB DESCRIPTION:
    ${jobDescription}

    RESUME:
    ${resume}`,
            },
        ],
    });

    const rawText = message.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");

    const parsed = JSON.parse(rawText);
    return NextResponse.json(parsed);
};