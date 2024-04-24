using API.Entities.OrderAggregate;

namespace API.DTOs
{
    // this is to shape the order data returned in the response
    // then I will go create an orderExtension so I can "project" and select only the props I am interested in from the db
    public class OrderDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } // it will be the user's username

     
        public ShippingAddress ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } 
        public List<OrderItemDto> OrderItems { get; set; }
        public long SubTotal { get; set; }  
        public long DeliveryFee { get; set; }
        public string OrderStatus { get; set; } 

        public long Total { get; set; }
        
    }
}