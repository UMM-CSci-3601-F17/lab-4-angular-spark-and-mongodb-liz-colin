End to End

Todos are checked based on what values are given to the client side filters. Owner,
status, and content are each checked individually, as well as concurrently to ensure
that multiple filters return what would be expected. Client filters are tested, though
they are not used on the page in keeping with the rubric expectations. Tests for checking 
filtering interfaces for the users are also included.

Client-Side

The client side tests check that the todo object has the properties we are interested in
and that a list of todos can be filtered by them. Tests for the client filters were 
not expanded upon what was given since the todo page only uses server filtering. The client side
tests also checks the expected length of returned filtered todos, which is not covered by the
e2e tests. Finally, error checking is additionally included.

Server side

The server tests for returning all todos when requested and getting specific todos by their ids.
It also tests that filtering by the owner, status, and content properties returns the 
expected todos. Properties contain partial string matches are also tested and are working.
Multiple parameters are tested as well. The server tests check that adding a new todo
is successful, and that the added todo is able to be returned based on filtering, and 
can also be excluded from returned todos based on filtering choices.
