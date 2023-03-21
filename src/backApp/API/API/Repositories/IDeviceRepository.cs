namespace API.Repositories
{
    public interface IDeviceRepository
    {
        public Task<List<Timestamp>> GetTimestamps();
    }
}
