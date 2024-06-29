using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    // I am gonna extend the List<Product> here, and I am gonna add the MetaData as well so I can include the pagination info with the list returned
    public class PagedList<T> : List<T> // <T> generic type parameter
    {
        public MetaData MetaData { get; set; }

        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData 
            {
                TotalCount = count,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            AddRange(items);
        }

        // creating a static method so I do not have to create another instance of the pagedList class whenever I need to use the method

        public static async Task<PagedList<T>> ToPageList(IQueryable<T> query, 
            int pageNumber, int pageSize)
        {
            // executing this against the Db to get the number of items available
            var count = await query.CountAsync();
            // the skip and take operators, for example skip(2-1)*10 = 10 take(10) means that on the page 2 we've skipped the first 10 and take the next 10.
            var items = await query.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items,count, pageNumber, pageSize); // the order of the parameters has to match the constructor's
        }
    }
}

// after finishing creating this class I am gonna to the products controller to change what the get method returns.
// which now will be a PagedList