import { member } from "./index";
import { sampleList } from "./sample";
const util = require("util");

function optimallyAddMemberToJos(jos: member[][], unaddedMembers: member[]): void {
   let mockPossibilities: member[][][] = [];
   for (let h = 0; h < 3; h++) {
      let mockPossibility: member[][] = [];
      for (let i = 0; i < jos.length; i++) {
         mockPossibility.push([...jos[i]]);
      }
      mockPossibilities.push(mockPossibility);
   }

   
   console.log(util.inspect(mockPossibilities, { showHidden: false, depth: null, colors: true }));
}

let list: member[][] = [
   [{ name: "John", year: 2001, sex: "male", leader: false }],
   [],
   [{ name: "Jenny", year: 1996, sex: "female", leader: false }],
];
let unaddedList = sampleList;

optimallyAddMemberToJos(list, unaddedList);
