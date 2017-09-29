package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;


public class TodoControllerSpec {
    private TodoController todoController;
    private ObjectId toddsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    status: true,\n" +
            "                    content: \"Turn it in!\",\n" +
            "                    category: \"homework\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Patricia\",\n" +
            "                    status: false,\n" +
            "                    content: \"Go to class!\",\n" +
            "                    category: \"software design\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Jamie\",\n" +
            "                    status: true,\n" +
            "                    content: \"Manage zenhub issues\",\n" +
            "                    category: \"software design\"\n" +
            "                }"));

        toddsId = new ObjectId();
        BasicDBObject todd = new BasicDBObject("_id", toddsId);
        todd = todd.append("owner", "todd")
            .append("status", true)
            .append("content", "Become the champion of Norath")
            .append("category", "video games");


        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(todd.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }


    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Chris", "Patricia", "Jamie", "Todd");
        assertEquals("Owners should match", expectedOwners, owners);
    }

    @Test
    public void getToddById() {
        String jsonResult = todoController.getTodo(toddsId.toHexString());
        Document todd = Document.parse(jsonResult);
        assertEquals("Owner should match", "Todd", todd.get("owner"));
    }

    @Test
    public void getTodoByContent() {
        Map<String, String[]> contentMap1 = new HashMap<>();
        contentMap1.put("content", new String[] { "zen" });
        String jsonResult = todoController.getTodos(contentMap1);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be one Todo", 1, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Jamie");
        assertEquals("Names should match", expectedNames, names);
    }
}


