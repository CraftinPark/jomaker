import { member } from "./types";

export function createDiversifiedJos(n: number, list: member[], inclusionList: string[][], exclusionList: string[][]) {
   let jos: member[][] = turntableAssign(n, shuffleMembers(list));
   for (let i = 0; i < jos.length; i++) {
      for (let j = 0; j < jos[i].length; j++) {
         let startScore: number = calculateTotalScore(jos, inclusionList, exclusionList);
         let bestSwappedScore: number = 1000000000;
         let bestSwappedMember: number[] = [0, 0];
         for (let k = 0; k < jos.length; k++) {
            if (k === i) continue;
            for (let l = 0; l < jos[i].length; l++) {
               if (k === i && l === j) continue;
               swap([i, j], [k, l], jos);
               let swappedScore: number = calculateTotalScore(jos, inclusionList, exclusionList);
               swap([i, j], [k, l], jos);
               if (swappedScore < bestSwappedScore) {
                  bestSwappedScore = swappedScore;
                  bestSwappedMember = [k, l];
               }
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

export function turntableAssign(n: number, list: member[]): member[][] {
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

function swap(first: number[], second: number[], jos: member[][]): void {
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

export function shuffleMembers(members: member[]): member[] {
   for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j], members[i]];
   }
   return members;
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
   for (let i = 0; i < jos.length; i++) sum += calculateJoScore(jos[i], inclusionList, exclusionList);
   return sum;
}

function calculateJoScore(jo: member[], inclusionList: string[][], exclusionList: string[][]): number {
   let score: number = 0;
   score += ageScore(jo);
   score += sexScore(jo);
   score += leaderScore(jo);
   score += inclusionScore(jo, inclusionList);
   score += exclusionScore(jo, exclusionList);
   return score;
}

function ageScore(jo: member[]): number {
   let score: number = 0;
   for (let i = 0; i < jo.length - 1; i++) {
      for (let j = i + 1; j < jo.length; j++) {
         if (jo[i].year === jo[j].year) score++;
      }
   }
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
   return score;
}

function leaderScore(jo: member[]): number {
   let numLeaders: number = 0;
   for (let i = 0; i < jo.length; i++) {
      if (jo[i].leader === true) numLeaders++;
   }
   if (numLeaders === 0) return 1;
   else {
      let abs = Math.abs(numLeaders);
      return (abs / 2) * (abs + 1) * (abs / numLeaders) - 1 || 0;
   }
}

function inclusionScore(jo: member[], inclusionList: string[][]): number {
   let score: number = 0;
   for (let i = 0; i < inclusionList.length; i++) {
      for (let j = 0; j < inclusionList[i].length; j++) {
         if (jo.filter((m) => m.name === inclusionList[i][j]).length > 0) {
            for (let k = 0; k < inclusionList[i].length; k++) {
               if (k === j) continue;
               if (jo.filter((m) => m.name === inclusionList[i][k]).length === 0) score += 100;
            }
         }
      }
   }
   return score;
}

function exclusionScore(jo: member[], exclusionList: string[][]): number {
   let score: number = 0;
   for (let i = 0; i < exclusionList.length; i++) {
      for (let j = 0; j < exclusionList[i].length; j++) {
         if (jo.filter((m) => m.name === exclusionList[i][j]).length > 0) {
            for (let k = 0; k < exclusionList[i].length; k++) {
               if (k === j) continue;
               if (jo.filter((m) => m.name === exclusionList[i][k]).length > 0) score += 100;
            }
         }
      }
   }
   return score;
}
