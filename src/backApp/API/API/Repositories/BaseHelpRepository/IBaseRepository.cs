namespace API.Repositories.BaseHelpRepository
{
    public interface IBaseRepository<Something>
    {
        IQueryable<Something> FindAll();
    }
}
