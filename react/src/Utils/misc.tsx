import { getDocumentTitle } from "./scraping";

const singlePagePlayers = ["Alloha", "Kodik"];

export const isSinglePagePlayer = (name: string | undefined) => {
    return name && singlePagePlayers.includes(name);
};

export function updateDocumentTitle(newPage: Document | undefined) {
    const newTitle = getDocumentTitle(newPage);
    if (newTitle) {
        document.title = newTitle;
    }
}


const spoilersSplitRE = /(\[spoiler(?:=[^\]]*?)?\][\s\S]*?\[\/spoiler\])/m;
const spoilersMatchRE = /\[spoiler=?(?<label>[^\]]*?)?\](?<content>[\s\S]*?)\[\/spoiler\]/m;

export function parseShikimoriDescription(description: string | undefined) {
    if (!description) return undefined;

    const spoilerSplit = description.split(spoilersSplitRE).filter(e => e !== "");
    return spoilerSplit.map(e => {
        const spoilerMatch = e.match(spoilersMatchRE);
        return ({
            type: spoilerMatch ? "spoiler" : "non-spoiler",
            label: spoilerMatch ? spoilerMatch.groups!.label || "Спойлер" : undefined,
            children: parseReferences(spoilerMatch ? spoilerMatch.groups!.content : e)
        });
    });
}

const referenceSplitRE = /(\[[^=]*?=\d{1,7}(?: \S*?)?\](?:[ \S]*?\[\/.*?\])?)/m;
const referenceMatchRE = /\[(?<type>[^=]*?)=(?<id>\d{1,7}) ?(?<name>[^\]]*?)\](?:(?<content>[\S ]*?)\[\/\1\])?/m;

function parseReferences(text: string) {
    const split = text.split(referenceSplitRE).filter(e => e !== "");

    return split.map(e => {
        const match = e.match(referenceMatchRE);
        return ({
            type: match ? match.groups!.type : "text",
            id: match ? match.groups!.id : undefined,
            content: match ? (match.groups!.content || capitalize(match.groups!.name)) : e,
        });
    });
}

export function capitalize(s: string)
{
    return s[0].toUpperCase() + s.slice(1);
}

export function isAnyMetaKeyPressed(e: KeyboardEvent) {
    return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey
}