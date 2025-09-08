const Diff3 = require('node-diff3');

const baseVersion = 'ciao come stai tu';
const latestVersion = 'ciao come stai tutto bene grazie tu'; 
const remoteVersion = 'ciao come stai male';

const result = Diff3.diff3Merge(latestVersion, baseVersion, remoteVersion);

const processMergeResult = (mergeResult) => {
  let finalString = '';

  mergeResult.forEach(hunk => {
    if (hunk.ok) {
      finalString += hunk.ok.join(' ') + ' ';
    } else if (hunk.conflict) {
      // Concatenate 'a' and 'b' to get both changes
      finalString += (hunk.conflict.a.join(' ') + ' ') + (hunk.conflict.b.join(' ') + ' ');
    }
  });

  return finalString;
};

const mergedText = processMergeResult(result);
console.log(mergedText);




/**
 * this has to happen only when the 
 * update remote => check if remote and base versions are equal => they won't be, so => merge
 */