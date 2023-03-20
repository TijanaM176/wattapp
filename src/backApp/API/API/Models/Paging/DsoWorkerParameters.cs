namespace API.Models.Paging
{
    public class DsoWorkerParameters
    {
        const int maxPageSize = 40;
        public int PageNumber { get; set; } = 1;

        private int pageSize = 8;

        public int PageSize
        {
            get
            {

                return pageSize;
            }
            set
            {

                pageSize = value > maxPageSize ? maxPageSize : value;
            }

        }

    }
}
