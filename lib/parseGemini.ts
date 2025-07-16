export interface ReviewPieces { 
  stars: number; 
  title: string; 
  body: string 
}

export function splitReview(raw: string): ReviewPieces {
  const starMatch = raw.match(/\*\*(\d)\s+STERNE\*\*/i);
  const stars = starMatch ? Number(starMatch[1]) : 5;

  const codeBlocks = [...raw.matchAll(/```markdown\s*([\s\S]*?)\s*```/gi)]
                    .map(m => m[1].trim());

  if (codeBlocks.length < 2) throw new Error('Gemini returned unexpected format');

  return { stars, title: codeBlocks[0], body: codeBlocks[1] };
}
