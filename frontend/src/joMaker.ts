export type sex = "male" | "female";

export type member = {
   name: string;
   year: number;
   sex: sex;
   leader: boolean;
};

export function createDiversifiedJos(n: number, list: member[], inclusionList: string[][], exclusionList: string[][]) {
   let jos: member[][] = turntableAssign(n, list);
   //    console.log("start");
   // await continuePrompt();

   for (let i = 0; i < jos.length; i++) {
      for (let j = 0; j < jos[i].length; j++) {
         let startScore: number = calculateTotalScore(jos, inclusionList, exclusionList);

         //  console.log("start swaps for new element");
         //  console.log("indices: ", i, j);
         //  console.log(JSON.stringify(jos, null, 4));
         //  console.log(calculateTotalScore(jos, inclusionList, exclusionList));
         // await continuePrompt();

         // greedily swap for improvement in score.
         let bestSwappedScore: number = 1000000000;
         let bestSwappedMember: number[] = [0, 0];
         // for loop through other members.
         for (let k = 0; k < jos.length; k++) {
            if (k === i) continue;
            for (let l = 0; l < jos[i].length; l++) {
               if (k === i && l === j) continue;

               //    console.log("swap with");
               //    console.log("indices: ", k, l);

               swap([i, j], [k, l], jos);

               //    console.log(JSON.stringify(jos, null, 4));
               //    console.log(calculateTotalScore(jos, inclusionList, exclusionList));

               let swappedScore: number = calculateTotalScore(jos, inclusionList, exclusionList);
               swap([i, j], [k, l], jos);
               //    console.log("swap back");
               //    console.log(JSON.stringify(jos, null, 4));

               if (swappedScore < bestSwappedScore) {
                  bestSwappedScore = swappedScore;
                  bestSwappedMember = [k, l];
                  //   console.log("NEW BEST SCORE!");
               }
               //    console.log("current best score: ", bestSwappedScore);
               // await continuePrompt();
            }
         }

         if (bestSwappedScore >= startScore) continue;
         else {
            swap([i, j], [bestSwappedMember[0], bestSwappedMember[1]], jos);
            i = 0;
            j = 0;
         }
      }
   }

   return jos;
}

export function turntableAssign(n: number, list: member[]) {
   // form arbitrarily formed groups (in given order);
   let jos: member[][] = [];
   for (let i = 0; i < n; i++) jos.push([]);

   // turntable assignment
   let jo = 0;
   while (list.length > 0) {
      let lastMember = list.pop();
      if (lastMember) jos[jo].push(lastMember);
      if (jo + 1 === n) jo = 0;
      else jo++;
   }

   return jos;
}

function swap(first: number[], second: number[], jos: member[][]) {
   if (second[1] >= jos[second[0]].length) {
      jos[second[0]].splice(second[1], 0, jos[first[0]].splice(first[1], 1)[0]);
   } else if (second[1] >= jos[first[0]].length) {
      jos[first[0]].splice(first[1], 0, jos[second[0]].splice(second[1], 1)[0]);
   } else {
      let temp = jos[first[0]].splice(first[1], 1)[0];
      jos[first[0]].splice(first[1], 0, jos[second[0]].splice(second[1], 1)[0]);
      jos[second[0]].splice(second[1], 0, temp);
   }
}

export function shuffleMembers(members: member[]): void {
   for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j], members[i]];
   }
}

// ############################################################################
// SCORING SYSTEM
// - age score: a point for each member with same year as another member in jo
// - sex score: the difference in # of males to # of females in jo (unless only 1 member)
// - leader score: a point for each leader in a group (that is not the first leader)
// - inclusion list: if member in inclusion list is not included in jo, 100 points
// - exclusion list: if member is in the same jo as another member in exclusion list, 100 points
// ############################################################################

export function calculateTotalScore(jos: member[][], inclusionList: string[][], exclusionList: string[][]): number {
   let sum: number = 0;
   for (let i = 0; i < jos.length; i++) {
      // console.log("calculating score for jo #" + i);
      sum += calculateJoScore(jos[i], inclusionList, exclusionList);
   }
   return sum;
}

function calculateJoScore(jo: member[], inclusionList: string[][], exclusionList: string[][]): number {
   let score: number = 0;
   score += ageScore(jo);
   score += sexScore(jo);
   score += leaderScore(jo);
   score += inclusionScore(jo, inclusionList);
   score += exclusionScore(jo, exclusionList);
   // console.log(score);
   return score;
}

function ageScore(jo: member[]): number {
   let score: number = 0;
   for (let i = 0; i < jo.length - 1; i++) {
      for (let j = i + 1; j < jo.length; j++) {
         if (jo[i].year === jo[j].year) score++;
      }
   }
   // console.log("age score is " + score);
   return score;
}

function sexScore(jo: member[]): number {
   if (jo.length <= 1) return 0;
   let score: number = 0;
   let numMale: number = 0;
   let numFemale: number = 0;
   for (let i = 0; i < jo.length; i++) {
      if (jo[i].sex === "male") numMale++;
      else if (jo[i].sex === "female") numFemale++;
   }
   score = Math.abs(numMale - numFemale);
   // console.log("sex score is " + score);
   return score;
}

function leaderScore(jo: member[]): number {
   let numLeaders: number = 0;
   for (let i = 0; i < jo.length; i++) {
      if (jo[i].leader === true) numLeaders++;
   }
   if (numLeaders > 0) return (numLeaders - 1) * 3;
   else return 3;
}

// sample inclusionList:
// [[ "John", "Christina" ],
// [ "Daniel", "Elliot" ]]

function inclusionScore(jo: member[], inclusionList: string[][]): number {
   // check each member in jo for whether they are in the inclusion list.
   // for each occurence, confirm the inclusion members are in the list.
   // if not, add 100 points
   let score: number = 0;

   for (let i = 0; i < inclusionList.length; i++) {
      for (let j = 0; j < inclusionList[i].length; j++) {
         if (jo.filter((m) => m.name === inclusionList[i][j]).length > 0) {
            // confirm every member in inclusionList[i] is in jo.
            for (let k = 0; k < inclusionList[i].length; k++) {
               if (k === j) continue;
               if (jo.filter((m) => m.name === inclusionList[i][k]).length === 0) score += 100;
            }
         }
      }
   }
   return score;
}

function exclusionScore(jo: member[], inclusionList: string[][]): number {
   // check each member in jo for whether they are in the inclusion list.
   // for each occurence, confirm the inclusion members are not in the list.
   // if they are, add 100 points
   let score: number = 0;

   for (let i = 0; i < inclusionList.length; i++) {
      for (let j = 0; j < inclusionList[i].length; j++) {
         if (jo.filter((m) => m.name === inclusionList[i][j]).length > 0) {
            // confirm every member in inclusionList[i] is NOT in jo.
            for (let k = 0; k < inclusionList[i].length; k++) {
               if (k === j) continue;
               if (jo.filter((m) => m.name === inclusionList[i][k]).length > 0) score += 100;
            }
         }
      }
   }
   return score;
}
