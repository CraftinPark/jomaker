### Notes

- Score system seems the most reasonable choice.
- Thought of using greedy algorithm from a formed group: from an arbitrarily formed group, can I make each next step that would minimize the score?
- Thought of selecting from a list of ALL POSSIBLE permutations of the n members in x groups. Not a good idea as performance WILL suffer with even moderate to large size groups. (n^x runtimes)

- Greedy algorithm to start the formation of groups, while taking members from a depletable list? Current idea.

- adding one member greedily for each group will not work. The first group can take a potentially valuable member of group 2 since it does not affect (or even improves the score of) the first group. For example, if taking group member A is the best option for group 1 since it improves the score by 1, but it increases the penalty of group 2 by 6, there may be a better pick for group 1 that may lower the score by 2, but also lowers the next choice of group 2 by 2. (a 7 vs 2 score difference)

- Possible solution: temporarily give each jo their optimal choice. calculate the aftermath that will have of the other jos (when they are given their 2nd choices). Which one improves the score the most? Give the jo that minimized the score the most in that scenario.