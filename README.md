#Perk
Perk is a wiki focused on organizing educational content across the web along a graph data structure relating skills and learning materials with each other (i.e. a giant skill tree).

##Description / Vision
Video games called them skill trees and Khan Academy called them knowledge maps--whichever name you call them, graphs (the data structure consisting of vertices and edges) can be used to arrange skills or concepts to show their "is prerequisite to" relationships between each other. Perk adds another ingredient: self-contained collections of learning materials from the web which perk calls "learning modules" or simply "modules". We can arrange the skills and modules along the graph to reveal (Skill)-[Is Prerequisite To]->(Module)-[That Teaches]->(Skill) relationships. Doing so yields many benefits; a non-exhaustive list could be:
- Putting into context the rich library of educational content across the web that don't always make their prerequisites obvious, making them more accessible to learners.
- Highlighting nodes that a learner has progressed through, and providing cues when they should be reviewed makes it easier to spot holes and to avoid what Salman Khan called "Swiss Cheese Learning" (see his book "The One World Schoolhouse").
- By attaching data to nodes, such as financial and time cost to module nodes, and job availability and salaries to skill nodes, learners could make more informed decisions about the investment to reward ratio of working towards certain skills, and pick the skills they want accordingly.

##Usage
Please take note that I'm still working on some major features like user authentication, and update and delete for authorized users. Listed below are what can be done by users in the current state of the site. Users are expected to behave as either a LEARNER or as CONTRIBUTOR.

-A Learner, upon entering the site, is expected to:
1. Enter a keyword (e.g., "svg") on the searchbox to search for skill nodes or module nodes 
2. From the search results, pick a node that they would like to generate a learning path to
3. Clicking "Generate Path" isolates a path from the "E" node (the entry node representing no skills) towards the picked node.
4. Clicking "Start" opens up the first module along the learning path.
5. User goes through the learning materials then presses "Done"
6. User repeats step 5 until all the modules have been learned.

-A Contributor, upon entering the site, is expected to:
1. Pick the start node(s) for the "branch" they will be adding to the giant skill tree.
2. User is transferred to the Edit screen. Here they can pick which skill nodes will be the prerequisites for the module they're going to add, by clicking and highlighting them.
3. After selecting, the user presses "+" to go to the New Module screen.
4. Automatically, the Prerequisites section are filled up. The user specifies the objective nodes, and adds resources to one or both of the Learn and Practice sections, putting them into context by, for example, explaining the order the added resources are to be consumed, how they connect with each other, or whether only some portions of the given resource are relevant. When they're done, they submit the new module.
5. Repeat 2-4 as much as necessary.
6. Submit the branch.

##Contributing
Pull requests welcome. 
