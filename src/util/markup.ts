import { UnMatch, Match } from "./compare";

export function breakIntoAlternatingParts(text: string, unmatches: UnMatch[], matches: Match[]) {
    const indeces: number[] = [];
    unmatches.forEach((unmatch) => indeces.push(unmatch.from, unmatch.to));
    const spans: number[][] = [];
    for (let i = 0; i < indeces.length; i += 1) spans.push([indeces[i - 1] ?? 0, indeces[i]]);
    const parts = spans.map(span => text.substring(span[0], span[1]));
    const lastSpan = spans[spans.length - 1];
    parts.push(text.substr(lastSpan?.[1] || 0));
    return parts;
}

export function parseHTML(html: string) {
    const sketchpad = document.querySelector('#sketchpad');
    if (!sketchpad) return [''];
    sketchpad.innerHTML = html;

    const passages = Array.from(sketchpad.querySelectorAll('.passage'));
    return passages.map(passage => passage.outerHTML);
}