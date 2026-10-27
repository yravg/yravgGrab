---
name: yravgGrab-REA
description: >-
  Use when asked to reverse-engineer the top GitHub repos in an area (e.g.
  scheduling engines, CPM, resource leveling, 4D) to extract architecture,
  algorithms and data models for our own original work.
---
# yravgGrab-REA: reverse engineering anything from top GitHub repos

1. **Define the area and goal.** For example, CPM and resource leveling for a scheduling app. List what we need to learn.
2. **Find the repos.** Search GitHub for the area by keyword and topic. Rank them by stars, recent activity, maintenance and docs. Shortlist 5 to 10, and record each one's URL, stars, last commit, language and **licence**.
3. **Licence check.** Copying code is allowed only from permissive licences (MIT, Apache, BSD), and only with attribution. With GPL, AGPL or no licence, study the ideas and write your own code. Always note the licence next to each finding.
4. **Map the architecture.** Read the README, the folder layout and the entry points. Sketch the modules, data flow and key types, using a mermaid diagram where it helps.
5. **Pull out the algorithms.** Locate the core logic, such as forward and backward passes, float, calendars, leveling heuristics and constraint handling. Explain each one in plain words and pseudocode, with file and line references.
6. **Pull out the data models.** Describe the entities, their fields and how they relate, including import and export formats such as XER, MSPDI and IFC.
7. **Compare.** Build a table of approaches with pros, cons and performance notes, then recommend an approach for our app.
8. **Write it up.** Save the findings to the knowledge base, for example `rea/<repo>.md` per repo plus a summary file. Use the read-only GitHub tools or a shallow clone in scratch space. Never push, fork or open issues without the user's say-so.
9. **Report.** Give the top takeaways, a reuse plan that respects licences, and any open questions.
