const util = require("util");
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
// EQUAL NUMBERS:
// 3 points for each group member
// point multiplier decays as previoius grouping is from longer ago. (e.g. the same grouping from 20 groupings ago will not add much score)

// create an algorithm that minimizes this score.

let list: member[] = sampleList;

function createJos(n: number, list: member[]) {
   let jos: member[][] = [];
   for (let i = 0; i < n; i++) jos.push([]);

   let unaddedMembers: member[] = list;
   shuffleMembers(unaddedMembers);

   while (unaddedMembers.length > 0) {
      // for (let i = 0; i < 5; i++) {
      optimallyAddMemberToJos(jos, unaddedMembers);
      console.log("///////////////////////////// new jos:");
      console.log(jos);
      console.log("///////////////////////////// new unaddedmembers: ");
      console.log(unaddedMembers);
   }

   // console.log(jos);
   // let totalScore: number = calculateTotalScore(jos);
   // console.log(totalScore);
}

function optimallyAddMemberToJos(jos: member[][], unaddedMembers: member[]): void {
   let mockPossibilities: member[][][] = [];
   for (let h = 0; h < jos.length; h++) {
      let mockPossibility: member[][] = [];
      for (let i = 0; i < jos.length; i++) mockPossibility.push([...jos[i]]);
      mockPossibilities.push(mockPossibility);
   }

   let possibleUnaddedMembers: member[][] = [];
   for (let i = 0; i < jos.length; i++) possibleUnaddedMembers.push([...unaddedMembers]);

   for (let i = 0; i < mockPossibilities.length; i++) {
      // let mockJos: member[][] = [];
      // for (let j = 0; j < mockPossibilities[i].length; j++) {
      //    mockJos.push([...mockPossibilities[i][j]]);
      // }
      let mockJos = mockPossibilities[i];
      let mockUnaddedMembers: member[] = possibleUnaddedMembers[i];
      let bestChoiceIndex = findJoBestChoice(mockJos, i, mockUnaddedMembers);
      if (mockUnaddedMembers.length > 0) {
         mockJos[i].push(mockUnaddedMembers[bestChoiceIndex]);
         mockUnaddedMembers.splice(bestChoiceIndex, 1);

         if (mockJos.length > 1) {
            let thisJo = [...mockJos[i]];
            mockJos.splice(i, 1);
            optimallyAddMemberToJos(mockJos, mockUnaddedMembers);
            mockJos.splice(i, 0, thisJo);
         }
      }
   }

   // console.log("mock possibility:");
   // console.log(util.inspect(mockPossibilities[0], { showHidden: false, depth: null, colors: true }));

   let mockScores = mockPossibilities.map((mockJo) => {
      return calculateTotalScore(mockJo);
   });
   let smallestTotalScore = Math.min(...mockScores);
   let optimalJoToGiveFirstChoice = mockScores.indexOf(smallestTotalScore);
   // console.log("give first choice to " + optimalJoToGiveFirstChoice);
   Object.assign(jos, mockPossibilities[optimalJoToGiveFirstChoice], {
      length: mockPossibilities[optimalJoToGiveFirstChoice].length,
   });
   Object.assign(unaddedMembers, possibleUnaddedMembers[optimalJoToGiveFirstChoice], {
      length: possibleUnaddedMembers[optimalJoToGiveFirstChoice].length,
   });
}

function findJoBestChoice(jos: member[][], j: number, unaddedMembers: member[]): number {
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
   return smallestScoringIndex;
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
      // console.log("calculating score for jo #" + i);
      sum += calculateJoScore(jos[i]);
   }
   return sum;
}

function calculateJoScore(jo: member[]): number {
   let score: number = 0;
   score += ageScore(jo);
   score += sexScore(jo);
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

createJos(3, list);
