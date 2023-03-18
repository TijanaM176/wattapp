namespace API.Models.Paging
{
    public class PagedList<Something>:List<Something>
    {
        public int CurrentPage { get; private set; }
        public int TotalCount { get; private set; } 
        //public int PageIndex { get; set; } = 0; // indeks stranice
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        
        public bool HasPrevious => CurrentPage > 1;
          
        public bool HasNext => CurrentPage < TotalPages;

        public PagedList(List<Something> items, int currentPage, int totalCount, int pageSize) // pageIndex
        {
            AddRange(items);
            CurrentPage = currentPage;//
            TotalCount = totalCount; //
            //PageIndex = pageIndex;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);//
            PageSize = pageSize;//
        
        }
        public static PagedList<Something> GetPagedList(IQueryable<Something> query, int pageNumber, int pageSize) 
        {
            var count = query.Count();
            var items = query.Skip((pageNumber - 1)* pageSize).Take(pageSize).ToList();


            return new PagedList<Something>(items, count, pageNumber, pageSize);
        }

    }
}
