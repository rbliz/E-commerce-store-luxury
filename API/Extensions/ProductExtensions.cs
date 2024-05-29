using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions // we do not want to create an instance of this class therefore it is a static one
    {
        // the idea of an extension method is that we make another method available for the IQueryable,
        // methods which are not there if we try to call them with the .dot 


        // inside the method we specify what we are extending
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy) 
        {
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);
              
            query = orderBy switch // I have to specify this because otherwise the get request will look for the parameter (string orderBy) and assume it as the query value 
                {
                    "price" => query.OrderBy(p => p.Price),
                    "priceDesc" => query.OrderByDescending(p => p.Price),
                    _ => query.OrderBy(p => p.Name), // default case _
                };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            // see if there is something inside the parameters
            if(!string.IsNullOrEmpty(brands)){
                brandList.AddRange(brands.ToLower().Split(",").ToList()); // splitting each item with a "," in the string of brands
            }

            if(!string.IsNullOrEmpty(types)){
                typeList.AddRange(types.ToLower().Split(",").ToList());
            }

            // I am returning a query that will look for all of the Brands that matche anything that's inside the list of brands
            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

            return query;
        }
    }
}