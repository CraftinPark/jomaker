import { member } from "./types";

export enum SortFilter {
   NameDescending,
   NameAscending,
   SecondaryNameDescending,
   SecondaryNameAscending,
   SexFemale,
   SexMale,
   YearDescending,
   YearAscending,
   LeaderFalse,
   LeaderTrue,
   None,
}

function sortMembers(sort: SortFilter, oldMembers: member[]): member[] {
   let members = [...oldMembers];
   switch (sort) {
      case SortFilter.NameDescending:
         members.sort((a, b) => {
            let fa = a.name.toLowerCase(),
               fb = b.name.toLowerCase();
            if (fa < fb) return -1;
            if (fa > fb) return 1;
            return 0;
         });
         return members;
      case SortFilter.NameAscending:
         members.sort((a, b) => {
            let fa = a.name.toLowerCase(),
               fb = b.name.toLowerCase();
            if (fa < fb) return 1;
            if (fa > fb) return -1;
            return 0;
         });
         return members;
      case SortFilter.SecondaryNameDescending:
         members.sort((a, b) => {
            let fa = a.secondaryName,
               fb = b.secondaryName;
            if (fa < fb) return -1;
            if (fa > fb) return 1;
            return 0;
         });
         return members;
      case SortFilter.SecondaryNameAscending:
         members.sort((a, b) => {
            let fa = a.secondaryName,
               fb = b.secondaryName;
            if (fa < fb) return 1;
            if (fa > fb) return -1;
            return 0;
         });
         return members;
      case SortFilter.SexMale:
         members.sort((a, b) => {
            let sa = a.sex === "male" ? 1 : 0,
               sb = b.sex === "male" ? 1 : 0;
            return sa - sb;
         });
         return members;
      case SortFilter.SexFemale:
         members.sort((a, b) => {
            let sa = a.sex === "female" ? 1 : 0,
               sb = b.sex === "female" ? 1 : 0;
            return sa - sb;
         });
         return members;
      case SortFilter.YearDescending:
         members.sort((a, b) => a.year - b.year);
         return members;
      case SortFilter.YearAscending:
         members.sort((a, b) => b.year - a.year);
         return members;
      case SortFilter.LeaderTrue:
         members.sort((a, b) => {
            let sa = !a.leader ? 1 : 0,
               sb = !b.leader ? 1 : 0;
            return sa - sb;
         });
         return members;
      case SortFilter.LeaderFalse:
         members.sort((a, b) => {
            let sa = a.leader ? 1 : 0,
               sb = b.leader ? 1 : 0;
            return sa - sb;
         });
         return members;
      default:
         return members;
   }
}

export default sortMembers;
