import { UnMatch } from "./compare";

export function breakIntoAlternatingParts(text: string, unmatches: UnMatch[]) {
    const indeces: number[] = [];
    unmatches.forEach((unmatch) => indeces.push(unmatch.from, unmatch.to));
    const spans: number[][] = [];
    for (let i = 0; i < indeces.length; i += 1) spans.push([indeces[i - 1] ?? 0, indeces[i]]);
    const parts = spans.map(span => text.substring(span[0], span[1]));
    return parts;
}