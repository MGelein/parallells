// const textA = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mauris lectus, imperdiet vitae gravida a, laoreet non sapien. Nullam vitae sem nibh. Integer ac est ac magna feugiat lobortis eget nec justo. Nunc ultrices ligula id porta congue. Nullam ut ligula turpis. Duis vel ipsum lectus. Maecenas sit amet est dapibus, viverra libero sit amet, consectetur purus. Cras eget ex lacinia, egestas quam nec, dictum mauris. In porta lacus orci, efficitur dignissim lorem euismod eu. Donec porta neque nulla, in efficitur odio bibendum egestas. Cras libero justo, egestas nec faucibus vitae, condimentum in lorem. Quisque vitae enim rhoncus, eleifend eros at, consequat odio. "
// const textB = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mauris lectus, imperdiet vitae gravida a, laoreet non sapien. Nullam vitae sem nibh. Integer ac est ac magna feugiat lobortis eget nec justo. Nunc ultrices ligula id porta congue. Nullam ut ligula turpis. Duis vel ipsum lectus. Maecenas sit amet est dapibus, viverra libero sit amet, consectetur purus. Cras eget ex lacinia, egestas quam nec, dictum mauris. In porta lacus orci, efficitur dignissim lorem euismod eu. Donec porta neque nulla, in efficitur odio bibendum egestas. Cras libero justo, egestas nec faucibus vitae, condimentum in lorem. Quisque vitae enim rhoncus, eleifend eros at, consequat odio. "
// const textC = "Lorem ipsum dolor, consectetur adipiscing elit. Integer mauris lectus, imperdiet vitae gravida a, laoreet non sapien. Nullam vitae sem nibh. Integer ac est ac magna feugiat lobortis eget nec justo. Nunc ultrices ligula id porta congue. Nullam ut ligula turpis. Duis vel ipsum lectus. Maecenas sit amet est dapibus, viverra libero sit amet, consectetur purus. Cras eget ex lacinia, egestas quam nec, dictum mauris. In porta lacus orci, efficitur dignissim lorem euismod eu. Donec porta neque nulla, in efficitur odio bibendum egestas. Cras libero justo, egestas nec faucibus vitae, condimentum in lorem. Quisque vitae enim rhoncus, eleifend eros at, consequat odio. "

const K = 10;

export const getDifferences = function (...texts: string[]) {
    console.time('processing')
    const textObjects = prepareTexts(texts)
    const dicts = buildDicts(textObjects)
    const mergedDict = mergeDicts(dicts[0], dicts)
    const matches = expandMatchingNGrams(mergedDict, textObjects)
    const matchesByText = calculateMatchesByText(matches)
    const unmatchedArray = calculateUnmatchedArrays(matchesByText, textObjects)
    const unmatchedTexts = calculateUnmatchedTexts(unmatchedArray, textObjects, texts)
    const unmatchedWithContext = calculateContext(unmatchedTexts, matches)
    console.timeEnd('processing')
    return unmatchedTexts;
}

const prepareTexts = function (texts: string[]) {
    const preparedTexts = []
    for (let id = 0; id < texts.length; id++) {
        /*eslint no-useless-escape: "off"*/
        preparedTexts.push({
            'id': id,
            'text': texts[id].trim().replace(/[\s\.,:;!\?]/g, '')
        })
    }
    return preparedTexts
}


const buildDicts = function (texts: Text[]) {
    return texts.map(text => buildDict(text))
}

const buildDict = function (textObject: Text) {
    const dict = {
        id: textObject.id,
        entries: new Map<string, number[]>()
    }
    const text = textObject.text
    for (let i = 0; i < text.length - K; i++) {
        const ngram = text.substr(i, K)
        if (dict.entries.has(ngram)) {
            dict.entries.get(ngram)?.push(i)
        } else {
            dict.entries.set(ngram, [i]);
        }
    }
    return dict as Dict;
}


const mergeDicts = function (mainDict: Dict, dicts: Dict[]) {
    let mergedDict: MergedDict = new Map<string, Map<TextId, TextIndex[]>>();
    for (let dict of dicts) {
        if (dict === mainDict) continue;
        mergedDict = mergeDict(mergedDict, mainDict, dict);
    }
    return mergedDict;
}

const mergeDict = function (mergedDict: MergedDict, mainDict: Dict, dict: Dict) {
    const overlapKeys: string[] = []
    mainDict.entries.forEach((_, mainKey) => {
        dict.entries.forEach((_, dictKey) => {
            if (mainKey === dictKey) overlapKeys.push(dictKey.toString());
        });
    });

    overlapKeys.forEach((overlapKey) => {
        if (mergedDict.has(overlapKey)) {
            const map = mergedDict.get(overlapKey);
            const overlap = dict.entries.get(overlapKey);
            if (map && overlap) map.set(dict.id, overlap);
        } else {
            const map = new Map<TextId, TextIndex[]>();
            const mainOverlap = mainDict.entries.get(overlapKey)
            const dictOverlap = dict.entries.get(overlapKey);
            if (mainOverlap) map.set(mainDict.id, mainOverlap)
            if (dictOverlap) map.set(dict.id, dictOverlap)
            mergedDict.set(overlapKey, map);
        }
    })

    return mergedDict;
}


const expandMatchingNGrams = function (mergedDict: MergedDict, texts: Text[]) {
    let matches: Match[] = []
    mergedDict.forEach((ngramDict) => {
        const newMatches = expandMatchingNGram(ngramDict, texts, matches);
        matches = [...matches, ...newMatches];
    })
    return matches;
}

const expandMatchingNGram = function (ngramDict: Map<number, number[]>, texts: Text[], existingMatches: Match[]) {
    const matches: Match[] = []
    const mainId = texts[0].id;
    ngramDict.forEach((ngramOccurences, textId) => {
        const mainOccurences = ngramDict.get(mainId);
        if (!mainOccurences || mainOccurences === ngramOccurences) return;

        mainOccurences.forEach(mainOccurence => {
            ngramOccurences.forEach(ngramOccurence => {
                const main = { id: mainId.valueOf(), index: mainOccurence.valueOf() };
                const other = { id: textId.valueOf(), index: ngramOccurence.valueOf() };
                const match = expandMatchingNGramPair(main, other, texts, existingMatches);
                if (match) matches.push(match);
            })
        })
    })
    return matches
}

const expandMatchingNGramPair = function (main: Occurence, other: Occurence, texts: Text[], matches: Match[]) {
    if (containedInExistingMatch(main, other, matches)) return

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

    const match = new Map<TextId, Range>();
    match.set(main.id, { from: main.index - backward, to: main.index + forward });
    match.set(other.id, { from: main.index - backward, to: main.index + forward });
    return match
}

const containedInExistingMatch = function (main: Occurence, other: Occurence, matches: Match[]) {
    for (let match of matches) {
        const mainMatch = match.get(main.id);
        const otherMatch = match.get(other.id);
        if (mainMatch && otherMatch) {
            const mainContained = mainMatch.from < main.index && mainMatch.to > main.index
            const otherContained = otherMatch.from < other.index && otherMatch.to > other.index
            if (mainContained && otherContained) return true
        }
    }
    return false
}

const calculateMatchesByText = function (matches: Match[]) {
    const byText = new Map<TextId, Range[]>();
    matches.forEach(match => {
        match.forEach((range, textId) => {
            if (!byText.has(textId)) byText.set(textId, [range]);
            else {
                byText.get(textId)?.push(range);
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
    const unmatchedTexts = new Map<TextId, UnMatch[]>();
    textObjects.forEach(({ id, text }) => {
        unmatchedTexts.set(id, calculateUnmatchedText(arrays.get(id) ?? [], text, origTexts[id]));
    })
    return unmatchedTexts
}

const calculateUnmatchedText = function (array: Boolean[], text: string, origText: string) {
    const unmatches: UnMatch[] = []
    const counter = new Map<string, number>();
    let inUnmatchedText = false
    let i, startIndex = 0
    for (i = 0; i < array.length; i++) {
        let char = text.charAt(i)
        const currentCount = counter.get(char);
        if (currentCount) counter.set(char, currentCount + 1);
        else counter.set(char, 1);

        if (array[i] && inUnmatchedText) {
            const unmatch = createUnmatch(startIndex, i, text, counter, origText);
            if (unmatch) unmatches.push(unmatch);
            inUnmatchedText = false
        } else if (!array[i] && !inUnmatchedText) {
            startIndex = i
            inUnmatchedText = true
        }
    }
    if (inUnmatchedText) {
        const unmatch = createUnmatch(startIndex, i, text, counter, origText);
        if (unmatch) unmatches.push(unmatch);
    }
    return unmatches
}

const createUnmatch = function (start: TextIndex, end: TextIndex, text: string, counter: CharacterCounter, origText: string) {
    const startChar = text.charAt(start)
    const endChar = text.charAt(end - 1)
    const startCount = counter.get(startChar);
    const endCount = counter.get(endChar);
    if (startCount === undefined || endCount === undefined) return;
    const unmatch: UnMatch = {
        urn: `${startChar}[${startCount}]-${endChar}[${endCount}]`,
        from: urnToIndex(startChar, startCount, origText),
        to: urnToIndex(endChar, endCount, origText) + 1,
        text: '',
    }
    unmatch.text = origText.substring(unmatch.from, unmatch.to)
    return unmatch
}

const calculateContext = function (unmatchedTexts: Map<TextId, UnMatch[]>, matches: Match[]) {
    const withContextUnMatches: { from: number, to: number, srcFrom: number, srcTo: number, urn: string, text: string }[] = [];
    unmatchedTexts.forEach((unmatches, textId) => {
        unmatches.forEach(unmatch => {
            const withContext = { ...unmatch, srcFrom: -1, srcTo: -1 };
            matches.forEach(match => {
                const textMatch = match.get(textId);
                if (!textMatch) return;
                if (textMatch.to === unmatch.from) {
                    withContext.srcFrom = match.get(0)?.to ?? -1;
                } else if (textMatch.from === unmatch.to) {
                    withContext.srcTo = match.get(0)?.from ?? -1;
                }
            });
            withContextUnMatches.push(withContext);
        });
    })
    return withContextUnMatches;
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

type CharacterCounter = Map<string, number>;
type Match = Map<TextId, Range>;
type CoverageMap = Map<TextId, Boolean[]>;
type UnMatch = { from: number, to: number, urn: string, text: string };
type Occurence = { id: TextId, index: TextIndex };
type Range = { from: TextIndex, to: TextIndex };
type MergedDict = Map<string, Map<TextId, TextIndex[]>>;
type Dict = { id: TextId, entries: Map<string, TextIndex[]> };
type Text = { id: TextId, text: string };
type TextId = number;
type TextIndex = number;
type TextMatches = Map<TextId, Range[]>