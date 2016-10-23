var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

StackerProvider = function(host, port) {
    this.db= new Db('node-mongo-stacker', new Server(host, port, {safe: true}, {auto_reconnect: true}, {}));
    this.db.open(function(error){
        if(error)
        {
            console.log("Stacker DB Open Failed: "+error.message);
        }});
};


StackerProvider.prototype.getCollection= function(callback) {
    this.db.collection('stackers', function(error, stacker_collection) {
        if( error ) callback(error);
        else callback(null, stacker_collection);
    });
};

//find all employees
StackerProvider.prototype.getAllLinks = function(callback) {
    this.getCollection(function(error, stacker_collection) {
        if( error ) callback(error)
        else {
            stacker_collection.find().toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

//find an employee by ID
StackerProvider.prototype.findByLink = function(link, callback) {
    this.getCollection(function(error, stacker_collection) {
        if( error ) callback(error)
        else {
            stacker_collection.findOne({link: link}, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};


//save new employee
StackerProvider.prototype.save = function(stackLink, callback) {
    this.getCollection(function(error, stacker_collection) {
        if( error ) callback(error)
        else {

            stackLink.created_at = new Date();

            stacker_collection.insert(stackLink, function() {
                callback(null, stackLink);
            });
        }
    });
};
//save new employee
StackerProvider.prototype.bulk = function(stackLink, callback) {
    this.getCollection(function(error, stacker_collection) {
        if( error ) callback(error)
        else {


            stacker_collection.insert({ "title": "What is a NullPointerException, and how do I fix it?",
                    "userId": "userId",
                    "link": "http://stackoverflow.com/questions/218384/what-is-a-nullpointerexception-and-how-do-i-fix-it",
                    "description": "What are Null Pointer Exceptions (java.lang.NullPointerException) and what causes them?What methods/tools can be used to determine the cause so that you stop the exception from causing the program to terminate prematurely?",
                    "answer": "NullPointerExceptions are exceptions that occur when you try to use a reference that points to no location in memory (null) as though it were referencing an object. Calling a method on a null reference or trying to access a field of a null reference will trigger a NullPointerException. These are the most common, but other ways are listed on the NullPointerException javadoc page.",
                    "tags": ["java"]}
                ,
                { "title": "Comparing two date strings in Python",
                    "userId": "userId",
                    "link": "http://stackoverflow.com/questions/20365854/comparing-two-date-strings-in-python",
                    "description": "Let's say I have a string: \"10/12/13\" and \"10/15/13\", how can I convert them into date objects so that I can compare the dates? For example to see which date is before or after.",
                    "answer": "Use datetime.datetime.strptime",
                    "tags": ["python"]},

                { "title": "How do you open a file in C++?",
                    "userId": "userId",
                    "link": "http://stackoverflow.com/questions/7880/how-do-you-open-a-file-in-c",
                    "description": "I want to open a file for reading, the C++ way. I need to be able to do it for text files: which would involve some sort of read line function, binary files: which would provide a way to read raw data into a char* buffer.",
                    "answer": "You need to use an ifstream if you just want to read (use an ofstream to write, or an fstream for both).",
                    "tags": ["c++"]},

                {
                    "title": "Differences between HashMap and Hashtable?",
                    "userId": "userId",
                    "link": "http://stackoverflow.com/questions/40471/differences-between-hashmap-and-hashtable",
                    "description": "What are the differences between a HashMap and a Hashtable in Java?Which is more efficient for non-threaded applications?",
                    "answer": "There are several differences between HashMap and Hashtable in Java:Hashtable is synchronized, whereas HashMap is not. This makes HashMap better for non-threaded applications, as unsynchronized Objects typically perform better than synchronized ones.Hashtable does not allow null keys or values.  HashMap allows one null key and any number of null values.One of HashMap's subclasses is LinkedHashMap, so in the event that you'd want predictable iteration order (which is insertion order by default), you could easily swap out the HashMap for a LinkedHashMap. This wouldn't be as easy if you were using Hashtable.Since synchronization is not an issue for you, I'd recommend HashMap. If synchronization becomes an issue, you may also look at ConcurrentHashMap.",
                    "tags": ["java"]},
                {
                    "title": "Create ArrayList from array",
                    "userId": "userId",
                    "link": "http://stackoverflow.com/questions/157944/create-arraylist-from-array",
                    "description": "I have an array that is initialized like:Element[] array = {new Element(1), new Element(2), new Element(3)};I would like to convert this array into an object of the ArrayList class.ArrayList Element arraylist = ???;",
                    "answer": "new ArrayListElement(Arrays.asList(array))",
                    "tags": ["java"]}, function() {
                callback(null, stackLink);
            });
        }
    });
};

// update an employee
/*EmployeeProvider.prototype.update = function(employeeId, employees, callback) {
    this.getCollection(function(error, employee_collection) {
        if( error ) callback(error);
        else {
            employee_collection.update(
                {_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
                employees,
                function(error, employees) {
                    if(error) callback(error);
                    else callback(null, employees)
                });
        }
    });
};*/

//delete employee
/*EmployeeProvider.prototype.delete = function(employeeId, callback) {
    this.getCollection(function(error, employee_collection) {
        if(error) callback(error);
        else {
            employee_collection.remove(
                {_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
                function(error, employee){
                    if(error) callback(error);
                    else callback(null, employee)
                });
        }
    });
};*/

exports.StackerProvider = StackerProvider;
