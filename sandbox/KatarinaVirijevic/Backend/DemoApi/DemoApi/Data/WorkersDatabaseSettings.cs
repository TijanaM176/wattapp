namespace DemoApi.Data
{
    public class WorkersDatabaseSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string WorkersCollectionName { get; set; } = string.Empty;
    }
}
