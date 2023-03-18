namespace API.Repositories
{
    public interface IBaseRepository<Something>
    {
        IQueryable<Something> FindAll();
    }
}
