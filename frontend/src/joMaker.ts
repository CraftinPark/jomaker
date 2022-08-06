export type sex = "male" | "female";

export type member = {
   name: string;
   year: number;
   sex: sex;
   leader: boolean;
};

export function createDiversifiedJos(n: number, list: member[]) {
   let jos: member[][] = turntableAssign(n, list);
   // console.log("start");
   // await continuePrompt();

   for (let i = 0; i < jos.length; i++) {
      for (let j = 0; j < jos[i].length; j++) {
         let startScore: number = calculateTotalScore(jos);

         // console.log("start swaps for new element");
         // console.log("indices: ", i, j);
         // console.log(jos);
         // console.log(calculateTotalScore(jos));
         // await continuePrompt();

         // greedily swap for improvement in score.
         let bestSwappedScore: number = 1000000000;
         let bestSwappedMember: number[] = [0, 0];
         // for loop through other members.
         for (let k = 0; k < jos.length; k++) {
            if (k === i) continue;
            for (let l = 0; l < jos[i].length; l++) {
               if (k === i && l === j) continue;

               // console.log("swap with");
               // console.log("indices: ", k, l);

               swap([i, j], [k, l], jos);

               // console.log(jos);
               // console.log(calculateTotalScore(jos));

               let swappedScore: number = calculateTotalScore(jos);
               swap([i, j], [k, l], jos);
               // console.log("swap back");
               // console.log(jos);

               if (swappedScore < bestSwappedScore) {
                  bestSwappedScore = swappedScore;
                  bestSwappedMember = [k, l];
                  // console.log("NEW BEST SCORE!");
               }
               // console.log("current best score: ", bestSwappedScore);
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
// ############################################################################

export function calculateTotalScore(jos: member[][]): number {
   let sum: number = 0;
   for (let i = 0; i < jos.length; i++) {
      // console.log("calculating score for jo #" + i);
      sum += calculateJoScore(jos[i]);
   }
   return sum;
}

function calculateJoScore(jo: member[]): number {
   let score: number = 0;
   score += ageScore(jo);
   score += sexScore(jo);
   score += leaderScore(jo);
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
   if (numLeaders > 0) return numLeaders - 1;
   else return 1;
}
