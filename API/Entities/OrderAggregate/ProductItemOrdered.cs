using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{

    // this will have a "snapshot" of the item has it was when it was ordered. (in case the properties change, we'll have the historic properties inside this table still...)
    
    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}