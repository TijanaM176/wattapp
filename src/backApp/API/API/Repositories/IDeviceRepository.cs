namespace API.Repositories
{
    public interface IDeviceRepository
    {
        public Task<string> GetDeviceName(string id);
    }
}
