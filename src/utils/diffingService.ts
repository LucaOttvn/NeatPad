type MergeRegion<T> =
    | { ok: T[]; conflict?: never }
    | { ok?: never; conflict: { a: T[]; aIndex: number; o: T[]; oIndex: number; b: T[]; bIndex: number } };

// Build a simple mapping of “o token -> replacement tokens from b”
// and any leading inserts in b that occur before the first o token.
function mapBaseToRemoteReplacements(o: string[], b: string[]) {
    const repl = new Map<string, string[]>();
    const insertedBefore: string[] = [];

    let iO = 0;
    let iB = 0;

    // Gather b tokens before the first o match (global insert-before)
    while (iB < b.length && (iO >= o.length || b[iB] !== o[iO])) {
        // Look ahead: if the token exists later in o, stop collecting
        const nextInO = o.indexOf(b[iB], iO);
        if (nextInO !== -1) break;
        insertedBefore.push(b[iB]);
        iB++;
    }

    while (iO < o.length && iB < b.length) {
        if (o[iO] === b[iB]) {
            iO++; iB++;
            continue;
        }
        // Replacement of o[iO] by some run of b tokens until next o token
        const nextMatchInB = (() => {
            for (let j = iB; j < b.length; j++) {
                if (j === iB) continue;
                const kInO = o.indexOf(b[j], iO + 1);
                if (kInO !== -1) return j;
            }
            return -1;
        })();

        const replacedBase = o[iO];
        const replacement = nextMatchInB === -1 ? b.slice(iB) : b.slice(iB, nextMatchInB);
        if (replacement.length) {
            // accumulate replacements per base token (handles multi-token replacements)
            const prev = repl.get(replacedBase) ?? [];
            repl.set(replacedBase, prev.concat(replacement));
        }
        iO += 1;
        iB = nextMatchInB === -1 ? b.length : nextMatchInB;
    }

    // Any trailing b tokens not aligned to o become appended inserts later
    const trailing = iB < b.length ? b.slice(iB) : [];

    return { repl, insertedBefore, trailing };
}

function combineConflict(o: string[], a: string[], b: string[]): string[] {
    const { repl, insertedBefore, trailing } = mapBaseToRemoteReplacements(o, b);

    const result: string[] = [];
    const insertedForBase = new Set<number>(); // guard against double insert per anchor in repeated tokens

    // Insert any global b-inserts that came before the first o alignment
    if (insertedBefore.length) result.push(...insertedBefore);

    for (let i = 0; i < a.length; i++) {
        const tok = a[i];
        result.push(tok);

        // If b replaced this base token, and local kept it, inject the remote replacement after it
        if (repl.has(tok)) {
            // To reduce duplicate injections on repeated tokens, only inject once per position
            if (!insertedForBase.has(i)) {
                result.push(...(repl.get(tok) ?? []));
                insertedForBase.add(i);
            }
        }
    }

    // If remote had trailing tokens not aligned to base, append them
    if (trailing.length) result.push(...trailing);

    // Best-effort dedupe of immediate repeats (optional)
    // return result.filter((t, idx, arr) => idx === 0 || arr[idx - 1] !== t);
    return result;
}

export function processMergeResult(mergeResult: MergeRegion<string>[]) {
    const pieces: string[] = [];

    for (const hunk of mergeResult) {
        if ('ok' in hunk && hunk.ok) {
            pieces.push(...hunk.ok);
        } else if ('conflict' in hunk && hunk.conflict) {
            const { a, o, b } = hunk.conflict;
            // Combine both sides relative to base
            pieces.push(...combineConflict(o, a, b));
        }
    }
    return pieces.join(' ').trim();
}


//// INITIAL BASIC MERGE LOGIC ////
// const processMergeResult = (mergeResult: Diff3.MergeRegion<unknown>[]) => {
//     let finalString = '';
//     mergeResult.forEach(hunk => {
//         if (hunk.ok) {
//             finalString += hunk.ok.join(' ') + ' ';
//         } else if (hunk.conflict) {
//             // Concatenate 'a' and 'b' to get both changes
//             finalString += (hunk.conflict.a.join(' ') + ' ') + (hunk.conflict.b.join(' '));
//         }
//     });
//     return finalString;
// };
