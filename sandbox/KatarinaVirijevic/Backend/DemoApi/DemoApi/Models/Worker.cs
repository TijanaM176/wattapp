using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace DemoApi.Models
{
    public class Worker
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; }

        [BsonElement("Department")]
        public string Department { get; set; }

        [BsonElement("Age")]
        public int Age { get; set; }
    }
}
