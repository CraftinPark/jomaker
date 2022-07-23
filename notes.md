### Notes

- Score system seems the most reasonable choice.
- Thought of using greedy algorithm from a formed group: from an arbitrarily formed group, can I make each next step that would minimize the score?
- Thought of selecting from a list of ALL POSSIBLE permutations of the n members in x groups. Not a good idea as performance WILL suffer with even moderate to large size groups. (n^x runtimes)

- Greedy algorithm to start the formation of groups, while taking members from a depletable list? Current idea.