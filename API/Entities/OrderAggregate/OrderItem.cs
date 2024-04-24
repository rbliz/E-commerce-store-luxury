namespace API.Entities.OrderAggregate
{

    // here I want a table to store the items in, therefore it will have an Id prop.
    // I have the owned entity ProductItemOrdered, thus it will be in the table too.
    public class OrderItem
    {
        public int Id { get; set; }
        public ProductItemOrdered ItemOrdered { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
    }
}