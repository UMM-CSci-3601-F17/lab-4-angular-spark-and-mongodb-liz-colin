package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for users.
     *
     * @param database the database containing user data
     */
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }


    /**
     * Get a JSON response with a list of all the todos in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one todo in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getTodo(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String todo;
        try {
            todo = getTodo(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested todo id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (todo != null) {
            return todo;
        } else {
            res.status(404);
            res.body("The requested todo with id " + id + " was not found");
            return "";
        }
    }


    /**
     * Get the single todo specified by the `id` parameter in the request.
     *
     * @param id the Mongo ID of the desired todo
     * @return the desired todo as a JSON object if the todo with that ID is found,
     * and `null` if no todo with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }

    /**
     * @param req
     * @param res
     * @return an array of todos in JSON formatted String
     */
    public String getTodos(Request req, Response res)
    {
        res.type("application/json");
        return getTodos(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Todos in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("status")) {
            boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }

        if (queryParams.containsKey("body")) {
            String targetContent =(queryParams.get("body")[0]);
            filterDoc = filterDoc.append("body", targetContent);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }


    /**
     *
     * @param req
     * @param res
     * @return
     */
    public boolean addNewTodo(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String owner = dbO.getString("owner");
                    boolean status = dbO.getBoolean("status");
                    String content = dbO.getString("content");
                    String category = dbO.getString("category");

                    System.err.println("Adding new todo [owner=" + owner + ", status=" + status + " content=" + content + " category=" + category + ']');
                    return addNewTodo(owner, status, content, category);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new todo request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }

    /**
     *
     * @param owner
     * @param status
     * @param content
     * @param category
     * @return
     */
    public boolean addNewTodo(String owner, boolean status, String content, String category) {

        Document newUser = new Document();
        newUser.append("owner", owner);
        newUser.append("status", status);
        newUser.append("content", content);
        newUser.append("category", category);

        try {
            todoCollection.insertOne(newUser);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }




}
