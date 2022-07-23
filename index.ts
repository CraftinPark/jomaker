import { sampleList } from "./sample";

export type sex = "male" | "female";

export type member = {
   name: string;
   year: number;
   sex: sex;
   leader: boolean;
};

// score system. minimize score.
// AGE:
// two people that share the same age is a point
// SEX:
// two people that share the same sex is a point
// LEADER:
// having more than a single leader in a group is a 2 point deduction.
// REPETITION:
// add point for each similar member from a previous grouping.
// point multiplier decays as previoius grouping is from longer ago. (e.g. the same grouping from 20 groupings ago will not add much score)

// create an algorithm that minimizes this score.

let list: member[] = sampleList;

function createJos(n: number, list: member[]) {
   // split list into n groups as evenly as possible.

   // initialize jos.
   let jos: member[][] = [];
   for (let i = 0; i < n; i++) jos.push([]);

   // we now have n empty jos

   let unaddedMembers: member[] = list;
   shuffleMembers(unaddedMembers);

   while (unaddedMembers.length > 0) {
      for (let j = 0; j < jos.length; j++) {
         // have your first choice, jo #j...
         // lets see if you deserve having your first choice at the end...
         let smallestScoringIndex: number = 0;
         let smallestScore: number = 1000000000;
         for (let i = 0; i < unaddedMembers.length; i++) {
            let mockJo: member[] = [...jos[j]];
            mockJo.push(unaddedMembers[i]);
            let mockScore: number = calculateJoScore(mockJo);
            if (mockScore < smallestScore) {
               smallestScoringIndex = i;
               smallestScore = mockScore;
            }
         }

         if (unaddedMembers.length > 0) {
            jos[j].push(unaddedMembers[smallestScoringIndex]);
            unaddedMembers.splice(smallestScoringIndex, 1);
         }
      }
   }

   console.log(jos);
   let totalScore: number = calculateTotalScore(jos);
   console.log(totalScore);
}

function shuffleMembers(members: member[]): void {
   for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j], members[i]];
   }
}

// ############################################################################
// SCORING SYSTEM
// - age score: a point for each member with same year as another member in jo
// - sex score: the difference in # of males to # of females in jo
// ############################################################################

function calculateTotalScore(jos: member[][]): number {
   let sum: number = 0;
   for (let i = 0; i < jos.length; i++) {
      console.log("calculating score for jo #" + i);
      sum += calculateJoScore(jos[i]);
   }
   return sum;
}

function calculateJoScore(jo: member[]): number {
   let score: number = 0;
   score += ageScore(jo);
   score += sexScore(jo);
   console.log(score);
   return score;
}

function ageScore(jo: member[]): number {
   let score: number = 0;
   for (let i = 0; i < jo.length - 1; i++) {
      for (let j = i + 1; j < jo.length; j++) {
         if (jo[i].year === jo[j].year) score++;
      }
   }
   console.log("age score is " + score);
   return score;
}

function sexScore(jo: member[]): number {
   let score: number = 0;
   let numMale: number = 0;
   let numFemale: number = 0;
   for (let i = 0; i < jo.length; i++) {
      if (jo[i].sex === "male") numMale++;
      else if (jo[i].sex === "female") numFemale++;
   }
   score = Math.abs(numMale - numFemale);
   console.log("sex score is " + score);
   return score;
}

createJos(5, list);
