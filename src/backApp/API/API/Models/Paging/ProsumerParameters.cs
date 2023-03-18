using Org.BouncyCastle.Asn1.X509;

namespace API.Models.Paging
{
    public class ProsumerParameters // for paging data prosumer
    {
        const int maxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int pageSize = 10;

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
