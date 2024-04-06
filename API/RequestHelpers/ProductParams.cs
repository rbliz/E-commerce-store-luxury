namespace API.RequestHelpers
{
    public class ProductParams : PaginationParams  // derives from the paginationParams thus it has their properties too
    {
        public string OrderBy { get; set; }

        public string SearchTerm { get; set; }

        public string Brands { get; set; }
        public string Types { get; set; }
    }
}