1) In the user controller constructor, we indicate which database we would like
to retrieve information from. We also specify that we would like to use a Gson
function to make objects from the JSON in the database. Lastly we state which type of
data we are interested in: users or todos.

In the server constructor, we indicate which mongo database to retrieve information from (dev),
set up the client to communicate with the database and create a user controller for handling
queries.

2) getUsers creates a new object of type documents that can be iterated over that
contains users. It then calls a method that finds users that have the id that matches
the string parameter to getUsers. Afterwards, it iterates through the object that contains
these found users and returns the user in a JSON format.

3) getUsers can be given a map with the key age and a string array with the integer age that
is desired. filterDoc is a document that is created to store the query parameters.
If age is found in the query parameter, the string value of the integer is parsed and then
put into the document along with the key age. This document is then used to find
matching users within the userCollection.

4) A document object is a linked hashmap that contains a string and corresponding object. 
It stores information that is received from the database and is also used as a means of
filtering that information.

5) clearAndPopulateDB is a method that's used to make a new instance of the information
we would like to conduct tests on to make sure that our queries are returning the 
appropriate users without accessing the actual database.

6) It checks that if we want to filter by the age 37, we will get back the correct
number of users that have that age and that their names are what we would expect them
to be.
