type Text = { id: TextId, text: string };
type TextId = number;
type TextIndex = number;
type MergedDict = Map<string, Map<TextId, TextIndex[]>>;
type Dict = Map<string, TextIndex[]>;
export type Match = { main: IdRange, other: IdRange }
type Occurence = { id: TextId, index: TextIndex };
type Range = { from: TextIndex, to: TextIndex };
type IdRange = { id: TextId, range: Range };
type TextMatches = Map<TextId, Range[]>
type CoverageMap = Map<TextId, Boolean[]>;
export type UnMatch = { from: number, to: number, urn: string, text: string };

export function getDifferences(texts: string[], K: number = 10) {
    const preparedTexts = prepareTexts(texts);
    const dicts = buildDicts(preparedTexts, K);
    const mergedDict = mergeDicts(dicts[0], dicts);
    const matches = expandMatchingNGrams(mergedDict, preparedTexts);
    const matchesByText = calculateMatchesByText(matches);
    const unmatchedArray = calculateUnmatchedArrays(matchesByText, preparedTexts);
    const unmatchedTexts = calculateUnmatchedTexts(unmatchedArray, preparedTexts, texts);
    return { unmatchedTexts, matches };
}

function prepareTexts(texts: string[]) {
    const preparedTexts: Text[] = []
    texts.forEach((text, id) => {
        /*eslint no-useless-escape: "off"*/
        preparedTexts.push({
            'id': id,
            'text': texts[id].trim().replace(/[\s\.、⋯《》」「』『,。，:;!"'“‘’”\?】—]/g, '')
        });
    });
    return preparedTexts
}


const buildDicts = function (texts: Text[], K: number) {
    return texts.map(text => buildDict(text, K))
}

const substr = function (s: string, from: number, length: number) {
    return s.substring(Math.max(0, from), Math.min(s.length, from + length));
}

const buildDict = function (textObject: Text, K: number) {
    const dict = new Map<string, number[]>()
    const text = textObject.text
    for (let i = -K; i < text.length; i++) {
        const ngram = substr(text, i, K);
        if (dict.has(ngram)) {
            dict.get(ngram)?.push(i)
        } else {
            dict.set(ngram, [i]);
        }
    }
    return dict as Dict;
}

const mergeDicts = function (mainDict: Dict, dicts: Dict[]) {
    let mergedDict: MergedDict = new Map<string, Map<TextId, TextIndex[]>>();
    dicts.forEach((dict, index) => {
        if (dict === mainDict) return;
        mergedDict = mergeDict(mergedDict, mainDict, dict, 0, index);
    });
    return mergedDict;
}

const mergeDict = function (mergedDict: MergedDict, mainDict: Dict, dict: Dict, mainId: TextId, dictId: TextId) {
    const overlapKeys: string[] = []
    mainDict.forEach((_, mainKey) => {
        dict.forEach((_, dictKey) => {
            if (mainKey === dictKey) overlapKeys.push(dictKey.toString());
        });
    });

    overlapKeys.forEach((overlapKey) => {
        if (mergedDict.has(overlapKey)) {
            const map = mergedDict.get(overlapKey);
            const overlap = dict.get(overlapKey);
            if (map && overlap) map.set(dictId, overlap);
        } else {
            const map = new Map<TextId, TextIndex[]>();
            const mainOverlap = mainDict.get(overlapKey)
            const dictOverlap = dict.get(overlapKey);
            if (mainOverlap) map.set(mainId, mainOverlap)
            if (dictOverlap) map.set(dictId, dictOverlap)
            mergedDict.set(overlapKey, map);
        }
    })

    return mergedDict;
}

const expandMatchingNGrams = function (mergedDict: MergedDict, texts: Text[]) {
    const matches: Match[] = []
    mergedDict.forEach((ngramDict) => {
        const newMatches = expandMatchingNGram(ngramDict, texts, matches);
        newMatches.forEach(newMatch => matches.push(newMatch));
    })
    return matches;
}

const expandMatchingNGram = function (ngramDict: Map<TextId, TextIndex[]>, texts: Text[], existingMatches: Match[]) {
    const matches: Match[] = []
    const mainId = 0;
    ngramDict.forEach((ngramOccurences, textId) => {
        const mainOccurences = ngramDict.get(mainId);
        if (!mainOccurences || mainOccurences === ngramOccurences) return;

        mainOccurences.forEach(mainOccurence => {
            ngramOccurences.forEach(ngramOccurence => {
                const main = { id: mainId, index: mainOccurence };
                const other = { id: textId, index: ngramOccurence };
                const match = expandMatchingNGramPair(main, other, texts, existingMatches);
                if (match) matches.push(match);
            })
        })
    })
    return matches
}

const expandMatchingNGramPair = function (main: Occurence, other: Occurence, texts: Text[], matches: Match[]) {
    if (containedInExistingMatch(main, other, matches, main.id, other.id)) return

    const mainText = texts[main.id].text
    const otherText = texts[other.id].text

    let forward = 0
    let mainChar, otherChar
    let mainIndex, otherIndex
    do {
        mainIndex = main.index + forward
        otherIndex = other.index + forward
        if (mainIndex >= mainText.length || otherIndex >= otherText.length) break

        mainChar = mainText.charAt(mainIndex)
        otherChar = otherText.charAt(otherIndex)
        forward++
    } while (mainChar === otherChar)
    forward--
    if (mainChar === otherChar) forward++

    let backward = 0
    do {
        backward++
        mainIndex = main.index - backward
        otherIndex = other.index - backward
        if (mainIndex < 0 || otherIndex < 0) break

        mainChar = mainText.charAt(main.index - backward)
        otherChar = otherText.charAt(other.index - backward)
    } while (mainChar === otherChar)
    backward -= 1

    const match = {
        main: { id: main.id, range: { from: main.index - backward, to: main.index + forward } },
        other: { id: other.id, range: { from: other.index - backward, to: other.index + forward } },
    }
    return match
}

const containedInExistingMatch = function (main: Occurence, other: Occurence, matches: Match[], mainId: number, otherId: number) {
    for (let match of matches) {
        const mainRange = match.main.range;
        const otherRange = match.other.range;
        if (mainRange && otherRange && mainId === match.main.id && match.other.id === otherId) {
            const mainContained = mainRange.from < main.index && mainRange.to > main.index
            const otherContained = otherRange.from < other.index && otherRange.to > other.index
            if (mainContained && otherContained) return true
        }
    }
    return false
}

const calculateMatchesByText = function (matches: Match[]) {
    const byText = new Map<TextId, Range[]>();
    matches.forEach(match => {
        [match.main, match.other].forEach(({ id, range }) => {
            if (!byText.has(id)) byText.set(id, [range]);
            else {
                byText.get(id)?.push(range);
            }
        })
    })
    return byText;
}


const calculateUnmatchedArrays = function (matches: TextMatches, textObjects: Text[]) {
    const unmatched = new Map<TextId, Boolean[]>();
    textObjects.forEach(({ text, id }) => {
        if (!unmatched.has(id)) unmatched.set(id, getNewMatchArray(text));
        const ranges = matches.get(id);
        ranges?.forEach(range => {
            const truthMap = unmatched.get(id);
            if (!truthMap) return;
            for (let i = range.from; i < range.to; i++) truthMap[i] = true;
            unmatched.set(id, truthMap);
        })

    })
    return unmatched
}

const getNewMatchArray = function (text: string) {
    return text.split('').map(() => false);
}

const calculateUnmatchedTexts = function (arrays: CoverageMap, textObjects: Text[], origTexts: string[]) {
    const unmatchedTexts: UnMatch[][] = [];
    textObjects.forEach(({ id, text }) => {
        unmatchedTexts.push(calculateUnmatchedText(arrays.get(id) ?? [], text, origTexts[id]));
    })
    return unmatchedTexts
}

const calculateUnmatchedText = function (array: Boolean[], text: string, origText: string) {
    const unmatches: UnMatch[] = []
    const counter = new Map<string, number>();
    let inUnmatchedText = false
    let i, startIndex = 0
    const counterPerCharacter: number[] = [];
    for (i = 0; i < array.length; i++) {
        let char = text.charAt(i)
        const currentCount = counter.get(char);
        if (currentCount) counter.set(char, currentCount + 1);
        else counter.set(char, 1);
        counterPerCharacter[i] = counter.get(char) ?? -1;

        if (array[i] && inUnmatchedText) {
            const unmatch = createUnmatch(startIndex, i, text, counterPerCharacter, origText);
            if (unmatch) unmatches.push(unmatch);
            inUnmatchedText = false
        } else if (!array[i] && !inUnmatchedText) {
            startIndex = i
            inUnmatchedText = true
        }
    }
    if (inUnmatchedText) {
        const unmatch = createUnmatch(startIndex, undefined, text, counterPerCharacter, origText);
        if (unmatch) unmatches.push(unmatch);
    }
    return unmatches
}

const createUnmatch = function (start: TextIndex, end: TextIndex | undefined, text: string, counter: number[], origText: string) {
    const startChar = text.charAt(start)
    const endChar = text.charAt(end ?? counter.length - 1)
    const startCount = counter[start];
    const endCount = counter[end ?? counter.length - 1];
    if (startCount === undefined || endCount === undefined) return;
    const unmatch: UnMatch = {
        urn: `${startChar}[${startCount}]-${endChar}[${endCount}]`,
        from: urnToIndex(startChar, startCount, origText),
        to: urnToIndex(endChar, endCount, origText),
        text: '',
    }
    unmatch.text = origText.substring(unmatch.from, unmatch.to)
    return unmatch
}

const urnToIndex = function (char: string, count: number, text: string) {
    let counter = 0
    let index = 0
    for (let character of text) {
        if (char === character) {
            counter++
            if (counter === count) {
                return index
            }
        }
        index++
    }
    return index
}